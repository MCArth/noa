
import vec3 from 'gl-vec3'


export default function (noa) {
    return {

        name: 'mesh',

        order: 100,

        state: {
            mesh: null,
            offset: null,
            isPickable: false,
            shouldAddMeshToScene: true,
        },


        onAdd: function (eid, state) {
            // implicitly assume there's already a position component
            var posDat = noa.ents.getPositionData(eid)
            if (!state.mesh) {
                throw new Error('Mesh component added without a mesh - probably a bug!')
            }
            if (state.shouldAddMeshToScene) {
                noa.rendering.addMeshToScene(
                    state.mesh,
                    false,
                    posDat.position,
                    null,
                    state.isPickable
                );
                // CHANGE ARTHUR START
                // Adds descendant children to scene - a working variant of this may be needed in future
                // for (let descendant of state.mesh.getDescendants()) {
                //     noa.rendering.addMeshToScene(descendant, false);
                // }
                // CHANGE ARTHUR END
            } 
            if (!state.offset) state.offset = vec3.create()

            // set mesh to correct position
            var rpos = posDat._renderPosition
            state.mesh.position.copyFromFloats(
                rpos[0] + state.offset[0],
                rpos[1] + state.offset[1],
                rpos[2] + state.offset[2])
        },


        onRemove: function (eid, state) {
            state.mesh.dispose()
        },



        renderSystem: function (dt, states) {
            // before render move each mesh to its render position, 
            // set by the physics engine or driving logic
            for (var i = 0; i < states.length; i++) {
                var state = states[i]
                var id = state.__id

                var rpos = noa.ents.getPositionData(id)._renderPosition
                state.mesh.position.copyFromFloats(
                    rpos[0] + state.offset[0],
                    rpos[1] + state.offset[1],
                    rpos[2] + state.offset[2])
            }
        }


    }
}
