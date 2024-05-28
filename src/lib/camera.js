
import vec3 from 'gl-vec3'
import aabb from 'aabb-3d'
import sweep from 'voxel-aabb-sweep'



// default options
function CameraDefaults() {
    this.inverseX = false
    this.inverseY = false
    this.sensitivityMult = 1
    this.sensitivityMultOutsidePointerlock = 0
    this.sensitivityX = 10
    this.sensitivityY = 10
    this.initialZoom = 0
    this.zoomSpeed = 0.2
}


// locals
var tempVectors = [
    vec3.create(),
    vec3.create(),
    vec3.create(),
]
var originVector = vec3.create()


/**
 * `noa.camera` - manages the camera, its position and direction, 
 * mouse sensitivity, and so on.
 * 
 * This module uses the following default options (from the options
 * object passed to the {@link Engine}):
 * ```js
 * var defaults = {
 *     inverseX: false,
 *     inverseY: false,
 *     sensitivityX: 10,
 *     sensitivityY: 10,
 *     initialZoom: 0,
 *     zoomSpeed: 0.2,
 * }
 * ```
*/

export class Camera {

    /** 
     * @internal 
     * @param {import('../index').Engine} noa
     * @param {Partial.<CameraDefaults>} opts
    */
    constructor(noa, opts) {
        opts = Object.assign({}, new CameraDefaults, opts)
        this.noa = noa

        /** Horizontal mouse sensitivity. Same scale as Overwatch (typical values around `5..10`) */
        this.sensitivityX = +opts.sensitivityX

        /** Vertical mouse sensitivity. Same scale as Overwatch (typical values around `5..10`) */
        this.sensitivityY = +opts.sensitivityY

        /** Mouse look inverse (horizontal) */
        this.inverseX = !!opts.inverseX

        /** Mouse look inverse (vertical) */
        this.inverseY = !!opts.inverseY

        /** 
         * Multiplier for temporarily altering mouse sensitivity.
         * Set this to `0` to temporarily disable camera controls.
        */
        this.sensitivityMult = opts.sensitivityMult

        /** 
         * Multiplier for altering mouse sensitivity when pointerlock
         * is not active - default of `0` means no camera movement.
         * Note this setting is ignored if pointerLock isn't supported.
         */
        this.sensitivityMultOutsidePointerlock = opts.sensitivityMultOutsidePointerlock

        /** 
         * Camera yaw angle. 
         * Returns the camera's rotation angle around the vertical axis. 
         * Range: `0..2π`  
         * This value is writeable, but it's managed by the engine and 
         * will be overwritten each frame.
        */
        this.heading = 0

        /** Camera pitch angle. 
         * Returns the camera's up/down rotation angle. The pitch angle is 
         * clamped by a small epsilon, such that the camera never quite 
         * points perfectly up or down.  
         * Range: `-π/2..π/2`.  
         * This value is writeable, but it's managed by the engine and 
         * will be overwritten each frame.
        */
        this.pitch = 0

        /** 
         * Entity ID of a special entity that exists for the camera to point at.
         * 
         * By default this entity follows the player entity, so you can 
         * change the player's eye height by changing the `follow` component's offset:
         * ```js
         * var followState = noa.ents.getState(noa.camera.cameraTarget, 'followsEntity')
         * followState.offset[1] = 0.9 * myPlayerHeight
         * ```
         * 
         * For customized camera controls you can change the follow 
         * target to some other entity, or override the behavior entirely:
         * ```js
         * // make cameraTarget stop following the player
         * noa.ents.removeComponent(noa.camera.cameraTarget, 'followsEntity')
         * // control cameraTarget position directly (or whatever..)
         * noa.ents.setPosition(noa.camera.cameraTarget, [x,y,z])
         * ```
        */
        this.cameraTarget = this.noa.ents.createEntity(['position'])

        // make the camera follow the cameraTarget entity
        var eyeOffset = 0.9 * noa.ents.getPositionData(noa.playerEntity).height
        noa.ents.addComponent(this.cameraTarget, 'followsEntity', {
            entity: noa.playerEntity,
            offset: [0, eyeOffset, 0],
        })

        /** How far back the camera should be from the player's eye position */
        this.zoomDistance = opts.initialZoom

        /** How quickly the camera moves to its `zoomDistance` (0..1) */
        this.zoomSpeed = opts.zoomSpeed

        /** Current actual zoom distance. This differs from `zoomDistance` when
         * the camera is in the process of moving towards the desired distance, 
         * or when it's obstructed by solid terrain behind the player.
         * This value will get overwritten each tick, but you may want to write to it
         * when overriding the camera zoom speed.
        */
        this.currentZoom = opts.initialZoom

        // bloxd start
        this.onCurrentZoomChange = null
        this.onCurrentZoomSetFromInternals = null

        this.targetX = 0
        this.targetY = 0

        this._targetKickback = 0
        this._appliedKickback = 0
        this._approachTargetKickbackRate = 0.009
        this._lastUpdateBeforeEntityRender = Date.now()

        this._kickbackDiffToApply = 0
        this._kickbackDecreaseRate = 0

        this.previousZoom = 0
        // this._kickbackIncreaseRate = 0
        // bloxd end

        /** @internal */
        this._dirVector = vec3.fromValues(0, 0, 1)
        
        /** @internal workaround for mac/chrome bug */
        this._skipOneInputForPLBug = false
    }




    /*
     * 
     * 
     *          API
     * 
     * 
    */


    /*
     *      Local position functions for high precision
    */
    /** @internal */
    _localGetTargetPosition() {
        var pdat = this.noa.ents.getPositionData(this.cameraTarget)
        var pos = tempVectors[0]
        return vec3.copy(pos, pdat._renderPosition)
    }
    /** @internal */
    _localGetPosition() {
        var loc = this._localGetTargetPosition()
        if (this.currentZoom === 0) return loc
        return vec3.scaleAndAdd(loc, loc, this._dirVector, -this.currentZoom)
    }



    /**
     * Returns the camera's current target position - i.e. the player's 
     * eye position. When the camera is zoomed all the way in, 
     * this returns the same location as `camera.getPosition()`.
    */
    getTargetPosition() {
        var loc = this._localGetTargetPosition()
        var globalCamPos = tempVectors[1]
        return this.noa.localToGlobal(loc, globalCamPos)
    }


    /**
     * Returns the current camera position (read only)
    */
    getPosition() {
        var loc = this._localGetPosition()
        var globalCamPos = tempVectors[2]
        return this.noa.localToGlobal(loc, globalCamPos)
    }

    /**
     * Returns the direction vector pointing up from the camera (up from top of player's head, for example)
     */
    getUpDirection () {
        return findVectorToPointOnUnitSphere(
            this.heading,
            this.pitch + Math.PI / 2
        );
    }

    setZoomDistance(zoomDistance) {
        this.previousZoom = this.zoomDistance
        this.zoomDistance = zoomDistance
        if (this.onCurrentZoomSetFromInternals) {
            this.onCurrentZoomSetFromInternals(this.previousZoom, zoomDistance)
        }
    }

    addKickback(kickback) {
        this._targetKickback += kickback
    }

    setKickbackDecreaseRate(decreaseRate) {
        this._kickbackDecreaseRate = decreaseRate
    }

    /**
     * Returns the camera direction vector (read only)
    */
    getDirection() {
        return this._dirVector
    }


    /*
     * 
     * 
     * 
     *          internals below
     * 
     * 
     * 
    */



    /**
     * Called before render, if mouseLock etc. is applicable.
     * Applies current mouse x/y inputs to the camera angle and zoom
     * @internal
    */

    applyInputsToCamera() {

        // conditional changes to mouse sensitivity
        var senseMult = this.sensitivityMult
        if (this.noa.container.supportsPointerLock) {
            if (!this.noa.container.hasPointerLock) {
                senseMult *= this.sensitivityMultOutsidePointerlock
            }
        }
        if (senseMult === 0) return

        // dx/dy from input state
        var pointerState = this.noa.inputs.pointerState
        if (pointerState.dx === 0 && pointerState.dy === 0) {
            return
        }

        /*
         * This is a workaround for two different chrome bugs:
         *  1. on Mac/chrome, ver~113 - can get wrong mousemove x/y data after
         *     gaining pointerlock. Doesn't happen immediately, but on the first
         *     non-zero mousemove event after gaining PL.
         *  2. on Win/chrome, ver~115, occasional bad mousemove data after
         *     releaseing pointerlock, but before getting event for losing PL.
         *  noa.container sets the ignore flag for both those cases, and best 
         *  we can do here is ignore one frame of mouse input.
         *  Note: have not filed either issue, I can't easily reproduce.
         *  If anyone else finds a way to, please file them!
        */
        if (this._skipOneInputForPLBug) {
            this._skipOneInputForPLBug = false
            return
        }

        // probably safe to remove this bugfix in the next update
        // bugFix(pointerState)

        // console.debug(pointerState.dx, pointerState.dy)
        bugFix2(pointerState) 

        // convert to rads, using (sens * 0.0066 deg/pixel), like Overwatch
        var conv = 0.0066 * Math.PI / 180
        var dx = pointerState.dx * this.sensitivityX * senseMult * conv
        var dy = pointerState.dy * this.sensitivityY * senseMult * conv
        if (this.inverseX) dx = -dx
        if (this.inverseY) dy = -dy

        dy -= this._kickbackDiffToApply
        this._kickbackDiffToApply = 0

        // normalize/clamp angles, update direction vector
        var twopi = 2 * Math.PI
        this.heading += (dx < 0) ? dx + twopi : dx
        if (this.heading > twopi) this.heading -= twopi
        var maxPitch = Math.PI / 2 - 0.001
        this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch + dy))

        vec3.set(this._dirVector, 0, 0, 1)
        var dir = this._dirVector
        var origin = originVector
        vec3.rotateX(dir, dir, origin, this.pitch)
        vec3.rotateY(dir, dir, origin, this.heading)
    }


    updateBeforeEntityRenderSystems(dt) {
        // zoom update
        const zoomMoveDist = (this.zoomDistance - this.currentZoom) * this.zoomSpeed
        if (Math.abs(zoomMoveDist) < 0.0001) {
            this.currentZoom = this.zoomDistance
        }
        else {
            this.currentZoom += zoomMoveDist
        }
        if (zoomMoveDist !== 0 && this.onCurrentZoomChange) {
            this.onCurrentZoomChange(this.currentZoom, this.currentZoom-zoomMoveDist)
        }

        const targetKickbackChange = this._targetKickback*this._kickbackDecreaseRate*dt
        
        if (targetKickbackChange < 0.0001) {
            this._targetKickback = 0
            this._kickbackDiffToApply = -this._appliedKickback
            this._appliedKickback = 0
        }
        else {
            this._targetKickback -= targetKickbackChange
        }

        const now = Date.now()
        const actualKickbackChange = (this._targetKickback-this._appliedKickback)*this._approachTargetKickbackRate*(now-this._lastUpdateBeforeEntityRender)
        if (Math.abs(actualKickbackChange) < 0.00001) {
            this._appliedKickback = this._targetKickback
        }
        else {
            this._kickbackDiffToApply += actualKickbackChange
            this._appliedKickback += actualKickbackChange
        }

        this._lastUpdateBeforeEntityRender = now
    }

    updateAfterEntityRenderSystems() {
        // clamp camera zoom not to clip into solid terrain
        var maxZZoom = Math.max(cameraObstructionZDistance(this)-0.2, 0)
        if (this.currentZoom > maxZZoom) this.currentZoom = maxZZoom

        if (this.noa.rendering.camera.position.x || this.noa.rendering.camera.position.y) {
            var maxYZoom = Math.max(cameraObstructionYDistance(this)-0.2, 0)
            if (this.noa.rendering.camera.position.y > maxYZoom) {
                this.noa.rendering.camera.position.y = maxYZoom
            }

            var maxXZoom = Math.max(cameraObstructionXDistance(this)-0.2, 0)
            if (this.noa.rendering.camera.position.x > maxXZoom) {
                this.noa.rendering.camera.position.x = maxXZoom
            }
        }
    }
}




/*
 *  check for obstructions behind camera by sweeping back an AABB
*/

function cameraObstructionZDistance(self) {
    if (!_camBox) {
        var off = self.noa.worldOriginOffset
        _camBox = new aabb([0, 0, 0], vec3.clone(_camBoxVec))
        _getVoxel = (x, y, z) => self.noa.world.getBlockSolidity(x + off[0], y + off[1], z + off[2])
        vec3.scale(_camBoxVec, _camBoxVec, -0.5)
    }
    _camBox.setPosition(self._localGetTargetPosition())
    _camBox.translate(_camBoxVec)
    var dist = Math.max(self.zoomDistance, self.currentZoom) + 0.5
    vec3.scale(_sweepVec, self.getDirection(), -dist)
    return sweep(_getVoxel, _camBox, _sweepVec, _hitFn, true)
}

// must be called after Z max distance and before X max distance (and Z max distance must have been applied)
function cameraObstructionYDistance(self) {
    _camBox.setPosition(self._localGetPosition())
    _camBox.translate(_camBoxVec)
    var dist = Math.max(self.targetY, self.noa.rendering.camera.position.y) + 0.5
    var dir = self.getUpDirection()
    vec3.scale(_sweepVec, dir, dist)
    return sweep(_getVoxel, _camBox, _sweepVec, _hitFn, true)
}

// must be called after Z and Y max distance (and Z+Y max distance must have been applied)
function cameraObstructionXDistance(self) {
    const position = self._localGetPosition()
    const yDir = findVectorToPointOnUnitSphere(self.heading, self.pitch+Math.PI/2)
    vec3.scaleAndAdd(position, position, yDir, self.noa.rendering.camera.position.y)
    _camBox.setPosition(position)
    _camBox.translate(_camBoxVec)
    var dist = Math.max(self.targetX, self.noa.rendering.camera.position.x) + 0.5
    const dir = findVectorToPointOnUnitSphere(self.heading-Math.PI/2, 0)
    vec3.scale(_sweepVec, dir, dist)
    return sweep(_getVoxel, _camBox, _sweepVec, _hitFn, true)
}

var _camBoxVec = vec3.fromValues(0.2, 0.2, 0.2)
var _sweepVec = vec3.create()
var _camBox
var _getVoxel
var _hitFn = () => true

// z is forward
// theta is angle about horizontal (can use cam.heading)
// phi is angle about vertical (can use cam.pitch)
export function findVectorToPointOnUnitSphere(theta, phi) {
    phi = Math.PI/2-phi
    theta = -theta
    const x = Math.sin(phi)*Math.sin(theta)
    const y = Math.cos(phi)
    const z = Math.sin(phi)*Math.cos(theta)
    return [x, y, -z]
}

export function vectorToUnitSphereAngles(vec) {
    const x = vec[0]
    const y = vec[1]
    const z = vec[2]

    const theta = -Math.atan2(x, -z)

    const horizMagnitude = ((x)**2+(z)**2)**(1/2)
    const phi = Math.atan2(y, horizMagnitude)

    return {theta, phi}
}



// workaround for this Chrome 63 + Win10 bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=781182
// later updated to also address: https://github.com/fenomas/noa/issues/153
// function bugFix(state) {
//     var dx = state.dx
//     var dy = state.dy
//     var wval = document.body.clientWidth / 6
//     var hval = document.body.clientHeight / 6
//     var badx = (Math.abs(dx) > wval && (dx / oldlastx) < -1)
//     var bady = (Math.abs(dy) > hval && (dy / oldlasty) < -1)
//     if (badx || bady) {
//         state.dx = oldlastx
//         state.dy = oldlasty
//         oldlastx = (dx > 0) ? 1 : -1
//         oldlasty = (dy > 0) ? 1 : -1
//     } else {
//         if (dx) oldlastx = dx
//         if (dy) oldlasty = dy
//     }
// }

// var oldlastx = 0
// var oldlasty = 0


// my bugfix2, replacing with andy's
// function bugFix2(state) {
//     const newDx = state.dx
//     if (newDx > lx && lx > 0 && newDx-lx > 150) {
//         state.dx = lx
//     }
//     else if (newDx < lx && lx < 0 && newDx-lx < -150) {
//         state.dx = lx
//     }
//     lx = newDx
// }

// let lx = 0


// later updated to also address: https://github.com/andyhall/noa/issues/153
function bugFix2(state) {
    var dx = state.dx
    var dy = state.dy
    var badx = (Math.abs(dx) > 100 && Math.abs(dx / lastx) > 4)
    var bady = (Math.abs(dy) > 100 && Math.abs(dy / lasty) > 4)
    if (badx || bady) {
        state.dx = lastx
        state.dy = lasty
        lastx = (lastx + dx) / 2
        lasty = (lasty + dy) / 2
    } else {
        lastx = dx || 1
        lasty = dy || 1
    }
}

var lastx = 0
var lasty = 0
