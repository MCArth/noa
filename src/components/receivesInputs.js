
/**
 * 
 * Input processing component - gets (key) input state and  
 * applies it to receiving entities by updating their movement 
 * component state (heading, movespeed, jumping, etc.)
 * 
 */

export default function (noa) {
    return {

        name: 'receivesInputs',

        order: 20,

        state: {
            joystickHeading: null,
            isTouchscreen: false,

            canRunCombinator: null,

            _moving: false, // whether player is moving at all. Only relevant for keyboard input.
            _running: false, // whether player is running. Only relevant for keyboard input.
        },

        onAdd: function registerForwardListener(eid, state) {
        },

        onRemove: null,

        renderSystem: function inputProcessor(dt, states) {
            var ents = noa.entities
            var inputState = noa.inputs.state
            var camHeading = noa.camera.heading

            for (var i = 0; i < states.length; i++) {
                var state = states[i]
                var moveState = ents.getMoveState(state.__id)

                if (state.isTouchscreen) {
                    // update rotation - running, etc update is done from react component
                    moveState.heading = (noa.camera.heading+(Math.PI*2)-(state.joystickHeading+3*Math.PI/2))%(Math.PI*2)
                }
                else {
                    // player on pc
                    setMovementState(noa.serverSettings, moveState, inputState, state, camHeading)
                }
            }
        },
    }
}



/**
 * @param {import('../components/movement').MovementState} state 
 * @param {Object<string, boolean>} inputs 
 * @param {number} camHeading 
*/


function setMovementState(serverSettings, state, inputs, keyboardMoverState, camHeading) {
    state.jumping = !!inputs.jump

    // var fb = state.fb = inputs.forward ? (inputs.backward ? 0 : 1) : (inputs.backward ? -1 : 0)
    // var rl = state.rl = inputs.right ? (inputs.left ? 0 : 1) : (inputs.left ? -1 : 0)
    var fb = inputs.forward ? (inputs.backward ? 0 : 1) : (inputs.backward ? -1 : 0)
    var rl = inputs.right ? (inputs.left ? 0 : 1) : (inputs.left ? -1 : 0)

    // this is ok - you can be crouching and sprint at same time
    if (inputs.crouch) {
        state.crouching = true
    }
    else {
        state.crouching = false
    }

    if ((fb | rl) === 0) {
        keyboardMoverState._moving = false
        keyboardMoverState._running = false
        state.speed = 0
    } else {
        keyboardMoverState._moving = true

        // pressing shift so start running
        if (!keyboardMoverState.canRunCombinator.getTotalBooleanVal()) {
            keyboardMoverState._running = false
        } else if (inputs.sprint) {
            keyboardMoverState._running = true
        }

        // states have been set, set maxSpeed
        if (state.crouching) {
            state.speed = serverSettings.crouchingSpeed
        }
        else if (keyboardMoverState._running) {
            state.speed = serverSettings.runningSpeed
        }
        else {
            // just walking
            state.speed = serverSettings.walkingSpeed
        }
        state.speedMultiplier.setMultiplierType(
            "serverSettingsSpeedMultiplier",
            serverSettings.speedMultiplier
        );

        let movementHeading = camHeading
        if (fb) {
            if (fb === -1) movementHeading += Math.PI
            if (rl) {
                movementHeading += Math.PI / 4 * fb * rl // didn't plan this but it works!
            }
        } else {
            movementHeading += rl * Math.PI / 2
        }
        state.heading = movementHeading
    }
}
