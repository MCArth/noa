
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
            doublePressRunInterval: 500,
            joystickHeading: null,
            isTouchscreen: false,

            _moving: false, // whether player is moving at all. Only relevant for keyboard input.
            _running: false, // whether player is running. Only relevant for keyboard input.
            _lastForwardPress: null
        },

        onAdd: function registerForwardListener(eid, state) {


            noa.inputs.down.on('forward', () => {
                const moveState = noa.ents.getMoveState(eid)
                const inputState = noa.inputs.state


                if (inputState.backward) { // can't start running while also going back!
                    return
                }

                // if player also pressed w/forward recently then they start running
                if (new Date().getTime() - state._lastForwardPress < state.doublePressRunInterval) {
                    moveState.running = true
                }
                state._lastForwardPress = new Date().getTime()
            })

            noa.inputs.down.on('sprint', () => {
                const inputState = noa.inputs.state
                if (inputState.forward && !inputState.backward) {
                }
            })
        },

        onRemove: null,

        renderSystem: function inputProcessor(dt, states) {
            var ents = noa.entities
            var inputState = noa.inputs.state
            var camHeading = noa.camera.heading

            states.forEach(state => {
                var moveState = ents.getMoveState(state.__id)

                if (state.isTouchscreen) {
                    // update rotation - running, etc update is done from react
                    moveState.heading = (noa.camera.heading+(Math.PI*2)-(state.joystickHeading+3*Math.PI/2))%(Math.PI*2)
                }
                else {
                    // player on pc
                    setMovementState(noa.serverSettings, moveState, inputState, state, camHeading)
                }
            })
        },

        // renderSystem: function rotationProcessor(dt, states) {
        //     for (const state of states) {
        //         var moveState = noa.ents.getMovement(state.__id)
        //         moveState.camHeading = noa.camera.heading
        //     }
        // }
    }
}

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
        if (inputs.sprint) {
            keyboardMoverState._running = true
        }

        // states have been set, set maxSpeed
        const speedMultiplier = serverSettings.speedMultiplier
        if (state.crouching) {
            state.speed = serverSettings.crouchingSpeed*speedMultiplier
        }
        else if (keyboardMoverState._running) {
            state.speed = serverSettings.runningSpeed*speedMultiplier
        }
        else {
            // just walking
            state.speed = serverSettings.walkingSpeed*speedMultiplier
        }


        if (fb) {
            if (fb === -1) camHeading += Math.PI
            if (rl) {
                camHeading += Math.PI / 4 * fb * rl // didn't plan this but it works!
            }
        } else {
            camHeading += rl * Math.PI / 2
        }
        state.heading = camHeading
    }
}
