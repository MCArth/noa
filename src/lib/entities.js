
import { updatePositionExtents } from '../components/position.js'
import { setPhysicsFromPosition } from '../components/physics.js'

import vec3 from 'gl-vec3'
import EntComp from 'ent-comp'
// var EntComp = require('../../../../npm-modules/ent-comp')

// import collideEntities from '../components/collideEntities.js'
// import collideTerrain from '../components/collideTerrain.js'
// import fadeOnZoom from '../components/fadeOnZoom.js'
// import followsEntity from '../components/followsEntity.js'
// import mesh from '../components/mesh.js'
import movement from '../components/movement.js'
import physics from '../components/physics.js'
import position from '../components/position.js'
// import receivesInputs from '../components/receivesInputs.js'
// import shadow from '../components/shadow.js'
// import smoothCamera from '../components/smoothCamera.js'
const components = {
    // 'collideEntities': {fn: collideEntities},
    // 'collideTerrain': {fn: collideTerrain},
    // 'fadeOnZoom': {fn: fadeOnZoom},
    // 'followsEntity': {fn: followsEntity},
    // 'mesh': {fn: mesh},
    'movement': {fn: movement, server: true},
    'physics': {fn: physics, server: true},
    'position': {fn: position, server: true},
    // 'receivesInputs': {fn: receivesInputs},
    // 'shadow': {fn: shadow},
    // 'smoothCamera': {fn: smoothCamera},
    'receivesInputs': {},
    'shadow': {},
    'smoothCamera': {},
    'collideEntities': {},
    'collideTerrain': {},
    'fadeOnZoom': {},
    'followsEntity': {},
    'mesh': {},
}




var defaultOptions = {
    shadowDistance: 10,
}


/**
 * `noa.entities` - manages entities and components.
 * 
 * This class extends [ent-comp](https://github.com/andyhall/ent-comp), 
 * a general-purpose ECS. It's also decorated with noa-specific helpers and 
 * accessor functions for querying entity positions, etc.
 * 
 * Expects entity definitions in a specific format - see source `components` 
 * folder for examples.
 * 
 * This module uses the following default options (from the options
 * object passed to the [[Engine]]):
 * 
 * ```js
 * var defaults = {
 *     shadowDistance: 10,
 * }
 * ```
*/

export class Entities extends ECS {

    /** @internal @prop noa */
    /** @internal @prop cameraSmoothed */

    // declare some accessors that will get made later

    /**
     * Returns whether the entity has a physics body
     * @type {(id:number) => boolean}
     * @prop hasPhysics
    */

    /**
     * Returns whether the entity has a mesh
     * @type {(id:number) => boolean}
     * @prop hasMesh
    */

    /**
     * Returns whether the entity has a position
     * @type {(id:number) => boolean}
     * @prop hasPosition
    */

    /**
     * Returns the entity's position component state
     * @type {(id:number) => {
     *      position: number[], width: number, height: number,
     *      _localPosition: any, _renderPosition: any, _extents: any,
     * }}
     * @prop getPositionData
    */

    /**
     * Returns the entity's position vector.
     * Note, will throw if the entity doesn't have the position component!
     * @type {(id:number) => number[]}
     * @prop getPosition
    */

    /**
     * Returns the entity's `physics` component state.
     * @type {(id:number) => { body:any }}
     * @prop getPhysics
    */

    /**
     * Returns the entity's physics body
     * Note, will throw if the entity doesn't have the position component!
     * @type {(id:number) => { any }}
     * @prop getPhysicsBody
    */

    /**
     * Returns the entity's `mesh` component state
     * @type {(id:number) => {mesh:any, offset:number[]}}
     * @prop getMeshData
    */

    /**
     * Returns the entity's `movement` component state
     * @type {(id:number) => import('../components/movement').MovementState}
     * @prop getMovement
    */

    /**
     * Returns the entity's `collideTerrain` component state
     * @type {(id:number) => {callback: function}}
     * @prop etCollideTerrain
    */

    /**
     * Returns the entity's `collideEntities` component state
     * @type {(id:number) => {
     *      cylinder:boolean, collideBits:number, 
     *      collideMask:number, callback: function}}
     * @prop getCollideEntities
    */

    /** 
     * A hash of the names of all registered components.
     * @type {Object<string, string>}
     * @prop names
    */


    /** @internal */
    constructor(noa, opts) {
        super()

        this.noa = noa
        opts = Object.assign({}, defaultOptions, opts)

        // properties
        /** Hash containing the component names of built-in components. */
        this.names = {}

        // optional arguments to supply to component creation functions
        var componentArgs = {
            'shadow': opts.shadowDistance,
        }

export function Entities(noa, opts) {
    // inherit from the ECS library
    EntComp.call(this)

    this.noa = noa
    this.opts = Object.assign({}, defaults, opts)




    // Bundler magic to import everything in the ../components directory
    // each component module exports a default function: (noa) => compDefinition
    // Only imports everything on client side (where require.context is defined)



    // let myRequireContext
    // if (typeof fs.statSync !== "function") {
    //     const reqContext = require.context('../components/', false, /\.js$/)
    //     console.log(reqContext.keys())
    //     reqContext.keys().forEach(name => {
    //         // convert name ('./foo.js') to bare name ('foo')
    //         var bareName = /\.\/(.*)\.js/.exec(name)[1]
    //         var arg = componentArgs[bareName] || undefined
    //         var compFn = reqContext(name)
    //         if (compFn.default) compFn = compFn.default
    //         var compDef = compFn(noa, arg)
    //         var comp = this.createComponent(compDef)
    //         this.names[bareName] = comp
    //     })
    // }
    // else {
    //     const reqContext = requireContext('../../src/components/', false, /\.js$/)
    //     console.log(reqContext.keys())
    //     reqContext.keys().forEach(name => {
    //         console.log("hello", name, /\.\/(.*)\.js/.exec(name))
    //         // convert name ('./foo.js') to bare name ('foo')
    //         var bareName = /\.\/(.*)\.js/.exec(name)[1]
    //         var arg = componentArgs[bareName] || undefined
    //         var compFn = reqContext(name)
    //         if (compFn.default) compFn = compFn.default
    //         var compDef = compFn(noa, arg)
    //         var comp = this.createComponent(compDef)
    //         this.names[bareName] = comp
    //     })
    // }






}

// inherit from EntComp
Entities.prototype = Object.create(EntComp.prototype)
Entities.prototype.constructor = Entities

/**
 * 
 * Create components needed client-side. Call assignFieldsAndHelpers() directly after.
 * 
 */
Entities.prototype.createComponentsClient = function() {
    // optional arguments to supply to component creation functions
    var componentArgs = {
        'shadow': this.opts.shadowDistance,
    }
    const reqContext = require.context('../components/', false, /\.js$/)
    reqContext.keys().forEach(name => {
        // convert name ('./foo.js') to bare name ('foo')
        var bareName = /\.\/(.*)\.js/.exec(name)[1]
        var arg = componentArgs[bareName] || undefined
        var compFn = reqContext(name)
        if (compFn.default) compFn = compFn.default
        var compDef = compFn(this.noa, arg)
        var comp = this.createComponent(compDef)
        this.names[bareName] = comp
    })
}

/**
 * 
 * Create components needed server-side. Call assignFieldsAndHelpers() directly after.
 * 
 */
Entities.prototype.createComponentsServer = function() {
    // optional arguments to supply to component creation functions
    var componentArgs = {
        'shadow': this.opts.shadowDistance,
    }
    for (const comp in components) {
        if (components[comp].fn) {
            this.createComponent(components[comp].fn(this.noa, componentArgs[comp]))
        }
        else {
            this.createComponent({name: comp}) // polyfill
        }
        this.names[comp] = comp
    }
    console.log(this.names)
}


/**
 * 
 * Call directly after either calling either createComponentsClient or createComponentsServer
 * 
 */
Entities.prototype.assignFieldsAndHelpers = function (noa) {
    // decorate the entities object with accessor functions
    /** @param id */
    this.isPlayer = function (id) { return id === noa.playerEntity }

    /** @param id */
    this.hasPhysics = this.getComponentAccessor(this.names.physics)

    /** @param id */
    this.cameraSmoothed = this.getComponentAccessor(this.names.smoothCamera)

    /** @param id */
    this.hasMesh = this.getComponentAccessor(this.names.mesh)

    // position functions
    /** @param id */
    this.hasPosition = this.getComponentAccessor(this.names.position)
    var getPos = this.getStateAccessor(this.names.position)

    /** @param id */
    this.getPositionData = getPos

    /** @param id */
    this._localGetPosition = function (id) {
        return getPos(id)._localPosition
    }

    /*
     * 
     * 
     *      PUBLIC ENTITY STATE ACCESSORS
     * 
     * 
    */


    /** Set an entity's position, and update all derived state.
     * 
     * In general, always use this to set an entity's position unless
     * you're familiar with engine internals.
     * 
     * ```js
     * noa.ents.setPosition(playerEntity, [5, 6, 7])
     * noa.ents.setPosition(playerEntity, 5, 6, 7)  // also works
     * ```
     * 
     * @param {number} id
     */
    setPosition(id, pos, y = 0, z = 0) {
        if (typeof pos === 'number') pos = [pos, y, z]
        // convert to local and defer impl
        var loc = this.noa.globalToLocal(pos, null, [])
        this._localSetPosition(id, loc)
    }

    /** Set an entity's size 
     * @param {number} xs
     * @param {number} ys
     * @param {number} zs
    */
    setEntitySize(id, xs, ys, zs) {
        var posDat = this.getPositionData(id)
        posDat.width = (xs + zs) / 2
        posDat.height = ys
        this._updateDerivedPositionData(id, posDat)
    }




    /**
     * called when engine rebases its local coords
     * @internal
     */
    _rebaseOrigin(delta) {
        for (var state of this.getStatesList(this.names.position)) {
            var locPos = state._localPosition
            var hw = state.width / 2
            nudgePosition(locPos, 0, -hw, hw, state.__id)
            nudgePosition(locPos, 1, 0, state.height, state.__id)
            nudgePosition(locPos, 2, -hw, hw, state.__id)
            vec3.subtract(locPos, locPos, delta)
            this._updateDerivedPositionData(state.__id, state)
        }
    }

    /** @internal */
    _localGetPosition(id) {
        return this.getPositionData(id)._localPosition
    }

    /** @internal */
    _localSetPosition(id, pos) {
        var posDat = this.getPositionData(id)
        vec3.copy(posDat._localPosition, pos)
        this._updateDerivedPositionData(id, posDat)
    }


    /** 
     * helper to update everything derived from `_localPosition`
     * @internal 
    */
    _updateDerivedPositionData(id, posDat) {
        vec3.copy(posDat._renderPosition, posDat._localPosition)
        var offset = this.noa.worldOriginOffset
        vec3.add(posDat.position, posDat._localPosition, offset)
        updatePositionExtents(posDat)
        var physDat = this.getPhysics(id)
        if (physDat) setPhysicsFromPosition(physDat, posDat)
    }






    /** 
     * Checks whether a voxel is obstructed by any entity (with the 
     * `collidesTerrain` component)
    */
    isTerrainBlocked(x, y, z) {
        // checks if terrain location is blocked by entities
        var off = this.noa.worldOriginOffset
        var xlocal = Math.floor(x - off[0])
        var ylocal = Math.floor(y - off[1])
        var zlocal = Math.floor(z - off[2])
        var blockExt = [
            xlocal + 0.001, ylocal + 0.001, zlocal + 0.001,
            xlocal + 0.999, ylocal + 0.999, zlocal + 0.999,
        ]
        var list = this.getStatesList(this.names.collideTerrain)
        for (var i = 0; i < list.length; i++) {
            var id = list[i].__id
            var ext = this.getPositionData(id)._extents
            if (extentsOverlap(blockExt, ext)) return true
        }
        return false
    }



    /** 
     * Gets an array of all entities overlapping the given AABB
    */
    getEntitiesInAABB(box, withComponent) {
        // extents to test against
        var off = this.noa.worldOriginOffset
        var testExtents = [
            box.base[0] + off[0], box.base[1] + off[1], box.base[2] + off[2],
            box.max[0] + off[0], box.max[1] + off[1], box.max[2] + off[2],
        ]
        // entity position state list
        var entStates
        if (withComponent) {
            entStates = []
            for (var compState of this.getStatesList(withComponent)) {
                var pdat = this.getPositionData(compState.__id)
                if (pdat) entStates.push(pdat)
            }
        } else {
            entStates = this.getStatesList(this.names.position)
        }

        // run each test
        var hits = []
        for (var i = 0; i < entStates.length; i++) {
            var state = entStates[i]
            if (extentsOverlap(testExtents, state._extents)) {
                hits.push(state.__id)
            }
        }
        return hits
    }



    /** 
     * Helper to set up a general entity, and populate with some common components depending on arguments.
    */
    add(position, width, height, // required
        mesh, meshOffset, doPhysics, shadow) {

        var self = this

        // new entity
        var eid = this.createEntity()

        // position component
        this.addComponent(eid, this.names.position, {
            position: position || [0, 0, 0],
            width: width,
            height: height
        })

        // rigid body in physics simulator
        if (doPhysics) {
            // body = this.noa.physics.addBody(box)
            this.addComponent(eid, this.names.physics)
            var body = this.getPhysics(eid).body

            // handler for physics engine to call on auto-step
            var smoothName = this.names.smoothCamera
            body.onStep = function () {
                self.addComponentAgain(eid, smoothName)
            }
        }

        // mesh for the entity
        if (mesh) {
            if (!meshOffset) meshOffset = vec3.create()
            this.addComponent(eid, this.names.mesh, {
                mesh: mesh,
                offset: meshOffset
            })
        }

/** 
 * Helper to set up a general entity, and populate with some common components depending on arguments.
 * 
 * Parameters: position, width, height [, mesh, meshOffset, doPhysics, shadow]
 * 
 * @param position
 * @param width
 * @param height..
 */
Entities.prototype.add = function (position, width, height, // required
    mesh, meshOffset, doPhysics, shadow, customEId) {

    var self = this

    // new entity
    var eid = customEId || this.createEntity()

    // position component
    this.addComponent(eid, this.names.position, {
        position: position || [0, 0, 0],
        width: width,
        height: height
    })

    // rigid body in physics simulator
    if (doPhysics) {
        // body = this.noa.physics.addBody(box)
        this.addComponent(eid, this.names.physics)
        var body = this.getPhysicsBody(eid)

        // handler for physics engine to call on auto-step
        var smoothName = this.names.smoothCamera
        body.onStep = function () {
            self.addComponentAgain(eid, smoothName)
        }

        return eid
    }
}


/*
 * 
 * 
 * 
 *          HELPERS
 * 
 * 
 * 
*/

// safety helper - when rebasing, nudge extent away from 
// voxel boudaries, so floating point error doesn't carry us accross
function nudgePosition(pos, index, dmin, dmax, id) {
    var min = pos[index] + dmin
    var max = pos[index] + dmax
    if (Math.abs(min - Math.round(min)) < 0.002) pos[index] += 0.002
    if (Math.abs(max - Math.round(max)) < 0.001) pos[index] -= 0.001
}

// compare extent arrays
function extentsOverlap(extA, extB) {
    if (extA[0] > extB[3]) return false
    if (extA[1] > extB[4]) return false
    if (extA[2] > extB[5]) return false
    if (extA[3] < extB[0]) return false
    if (extA[4] < extB[1]) return false
    if (extA[5] < extB[2]) return false
    return true
}

