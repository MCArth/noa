// import vec3 from 'gl-vec3'
const vec3 = require("gl-vec3");

/**
 *
 * Movement component. State stores settings like jump height, etc.,
 * as well as current state (running, jumping, heading angle).
 * Processor checks state and applies movement/friction/jump forces
 * to the entity's physics body.
 *
 */

exports.default = function (noa) {
    return {
        name: "moveState",

        order: 30,

        state: {
            // current state
            heading: 0, // radians
            crouching: false,
            speed: 0,
            jumping: false,
            cameraPitch: 0, // used for networked players

            speedMultiplier: null,
        },

        onAdd: null,

        onRemove: null,

        system: null,
    };
};
