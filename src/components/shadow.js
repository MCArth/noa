
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Color3 } from '@babylonjs/core/Maths/math'
var vec3 = require('gl-vec3')


export default function (noa, dist) {

    var shadowDist = dist

    // create a mesh to re-use for shadows
    var scene = noa.rendering.getScene()
    var disc = Mesh.CreateDisc('shadow', 0.75, 30, scene)
    disc.rotation.x = Math.PI / 2
    disc.material = noa.rendering.makeStandardMaterial('shadowMat')
    disc.material.diffuseColor = Color3.Black()
    disc.material.ambientColor = Color3.Black()
    disc.material.alpha = 0.5
    disc.setEnabled(false)

    // source mesh needn't be in the scene graph
    scene.removeMesh(disc)


    return {

        name: 'shadow',

        order: 80,

        state: {
            size: 0.5,
            _mesh: null,
        },


        onAdd: function (eid, state) {
            var mesh = disc.createInstance('shadow_instance')
            noa.rendering.addMeshToScene(mesh)
            state._mesh = mesh
        },


        onRemove: function (eid, state) {
            state._mesh.dispose()
        },


        system: function shadowSystem(dt, states) {
            var cpos = noa.camera._localGetPosition()
            var dist = shadowDist
            states.forEach(state => {
                var posState = noa.ents.getPositionData(state.__id)
                var physState = noa.ents.getPhysics(state.__id)
                var enabledCombinator
                if (noa.entities.hasComponent(state.__id, "genericPlayerState")) {
                    enabledCombinator = noa.entities.getState(state.__id, "genericPlayerState").shadowMeshEnabledCombinator
                }
                updateShadowHeight(noa, posState, physState, state._mesh, state.size, dist, cpos, enabledCombinator)
            })
        },


        renderSystem: function (dt, states) {
            // before render adjust shadow x/z to render positions
            states.forEach(state => {
                var rpos = noa.ents.getPositionData(state.__id)._renderPosition
                var spos = state._mesh.position
                spos.x = rpos[0]
                spos.z = rpos[2]
            })
        }




    }
}

var shadowPos = vec3.fromValues(0, 0, 0)
var down = vec3.fromValues(0, -1, 0)

function updateShadowHeight(noa, posDat, physDat, mesh, size, shadowDist, camPos, enabledCombinator) {

    // local Y ground position - from physics or raycast
    var localY
    if (physDat && (physDat.body.resting[1] < 0 || Number.isInteger(posDat._renderPosition[1]))) {
        localY = posDat._renderPosition[1]
    } else {
        var res = noa._localPick(posDat._renderPosition, down, shadowDist)
        if (!res) {
            if (enabledCombinator) {
                enabledCombinator.setBooleanType('placeToPutShadowExists', false)
            }
            else {
                mesh.setEnabled(false)
            }
            return
        }
        localY = res.position[1] - noa.worldOriginOffset[1]
    }

    // round Y pos and offset upwards slightly to avoid z-fighting
    localY = Math.round(localY) 
    vec3.copy(shadowPos, posDat._localPosition)
    shadowPos[1] = localY
    var sqdist = vec3.squaredDistance(camPos, shadowPos)
    // offset ~ 0.01 for nearby shadows, up to 0.1 at distance of ~40
    var offset = 0.01 + 0.1 * (sqdist / 1600)
    if (offset > 0.1) offset = 0.1
    mesh.position.y = localY + offset
    // set shadow scale
    var dist = posDat._localPosition[1] - localY
    var scale = size * 0.7 * (1 - dist / shadowDist)
    mesh.scaling.copyFromFloats(scale, scale, scale)
    if (enabledCombinator) {
        enabledCombinator.setBooleanType('placeToPutShadowExists', true)
    }
    else {
        mesh.setEnabled(true)
    }
}
