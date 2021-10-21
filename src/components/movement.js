
import vec3 from 'gl-vec3'





/** 
 * State object of the `movement` component
 * @class
*/
export function MovementState() {
    this.heading = 0 // radians
    this.running = false
    this.jumping = false

    // options
    this.maxSpeed = 10
    this.moveForce = 30
    this.responsiveness = 15
    this.runningFriction = 0
    this.standingFriction = 2

    // jumps
    this.airMoveMult = 0.5
    this.jumpImpulse = 10
    this.jumpForce = 12
    this.jumpTime = 500 // ms
    this.airJumps = 1

    // internal state
    this._jumpCount = 0
    this._currjumptime = 0
    this._isJumping = false
}





/**
 * Movement component. State stores settings like jump height, etc.,
 * as well as current state (running, jumping, heading angle).
 * Processor checks state and applies movement/friction/jump forces
 * to the entity's physics body. 
 * @param {import('..').Engine} noa
 * @internal
*/

export default function (noa) {
    return {

        name: 'movement',

        order: 30,

        state: new MovementState(),

        onAdd: null,

        onRemove: null,


        system: function movementProcessor(dt, states) {
            var ents = noa.entities
            for (var i = 0; i < states.length; i++) {
                var state = states[i]
                var phys = ents.getPhysics(state.__id)
                if (phys) applyMovementPhysics(dt, state, phys.body)
            }
        }


    }
}


var tempvec = vec3.create()
var tempvec2 = vec3.create()
var zeroVec = vec3.create()


/**
 * @internal
 * @param {number} dt 
 * @param {MovementState} state 
 * @param {*} body 
*/

function applyMovementPhysics(dt, state, body) {
    // move implementation originally written as external module
    //   see https://github.com/andyhall/voxel-fps-controller
    //   for original code

    if (!noa.entities.getState(state.__id, 'genericPlayerState').isAlive) {
        return;
    }

    // jumping
    var onGround = (body.atRestY() < 0)
    var canjump = (onGround || state._jumpCount < noa.serverSettings.airJumpCount)
    if (onGround) {
        state._isJumping = false
        state._jumpCount = 0
    }

    // process jump input
    if (moveState.jumping) {
        if (state._isJumping) { // continue previous jump
            if (state._currjumptime > 0) {
                var jf = state.jumpForce
                if (state._currjumptime < dt) { jf *= state._currjumptime / dt; }
                body.applyForce([0, jf, 0])
                state._currjumptime -= dt
            }
        } else if (canjump) { // start new jump
            state._isJumping = true
            if (!onGround) state._jumpCount++
            state._currjumptime = state.jumpTime
            body.applyImpulse([0, noa.serverSettings.jumpAmount, 0])
            // clear downward velocity on airjump
            if (!onGround && body.velocity[1] < 0) body.velocity[1] = 0
        }
    } else {
        state._isJumping = false
    }

    // apply movement forces if entity is moving, otherwise just friction
    var maxAmountToMove = tempvec
    var amountToActuallyMove = tempvec2
    if (moveState.speed) {
        var speed = moveState.speed*moveState.speedMultiplier.getTotalMultipliedVal()

        vec3.set(maxAmountToMove, 0, 0, speed)

        // rotate move vector to entity's heading
        vec3.rotateY(maxAmountToMove, maxAmountToMove, zeroVec, moveState.heading)

        // push vector to achieve desired speed & dir
        // following code to adjust 2D velocity to desired amount is patterned on Quake: 
        // https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/bg_pmove.c#L275
        vec3.subtract(amountToActuallyMove, maxAmountToMove, body.velocity)
        amountToActuallyMove[1] = 0
        var pushLen = vec3.length(amountToActuallyMove)
        vec3.normalize(amountToActuallyMove, amountToActuallyMove)

        if (pushLen > 0) {
            // pushing force vector
            var magnitudeToMove = state.moveForce
            if (!onGround) magnitudeToMove *= state.airMoveMult

            var maxMagnitude = state.responsiveness * pushLen
            if (magnitudeToMove > maxMagnitude) magnitudeToMove = maxMagnitude

            vec3.scale(amountToActuallyMove, amountToActuallyMove, magnitudeToMove)
            body.applyForce(amountToActuallyMove)
        }

        // different friction when not moving
        // idea from Sonic: http://info.sonicretro.org/SPG:Running
        body.friction = state.movingFriction
    } else {
        body.friction = state.standingFriction
    }
}
