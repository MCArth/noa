/** 
 * The Inputs class is found at [[Inputs | `noa.inputs`]].
 * @module noa.inputs
 */


// import { GameInputs } from '../../../game-inputs'
import { GameInputs } from 'game-inputs'


var defaultOptions = {
    preventDefaults: false,
    stopPropagation: false,
    allowContextMenu: false,
}

const defaultBindings = {
    "forward": ["KeyW", "ArrowUp"],
    "backward": ["KeyS", "ArrowDown"],
    "left": ["KeyA", "ArrowLeft"],
    "right": ["KeyD", "ArrowRight"],
    "fire": "Mouse1",
    "mid-fire": ["Mouse2", "KeyQ"],
    "alt-fire": ["Mouse3", "KeyE"],
    "jump": "Space",
    "sprint": "ShiftLeft",
    "crouch": ["ControlLeft", "KeyC", "CapsLock", "KeyZ", "Backslash", "IntlBackslash"],
}







/**
 * `noa.inputs` - Handles key and mouse input bindings.
 * 
 * This module extends 
 * [game-inputs](https://github.com/fenomas/game-inputs),
 * so turn on "Inherited" to see its APIs here, or view the base module 
 * for full docs.
 * 
 * This module uses the following default options (from the options
 * object passed to the [[Engine]]):
 */

 export class Inputs extends GameInputs {

    /** @internal */
    constructor(noa, opts, element) {
        opts = Object.assign({}, defaultOptions, opts)
        super(element, opts)

        var b = opts.bindings || defaultBindings
        for (var name in b) {
            var keys = Array.isArray(b[name]) ? b[name] : [b[name]]
            this.bind(name, ...keys)
        }
    }
}
