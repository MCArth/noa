
import makeInputs from 'game-inputs'
// import { Inputs as GameInputs } from '../../../../npm-modules/game-inputs'



var defaultOptions = {
    preventDefaults: false,
    stopPropagation: false,
    allowContextMenu: false,
}

var defaultBindings = {
    bindings: {
        "forward": ["W", "<up>"],
        "left": ["A", "<left>"],
        "backward": ["S", "<down>"],
        "right": ["D", "<right>"],
        "fire": "<mouse 1>",
        "mid-fire": ["<mouse 2>", "Q"],
        "alt-fire": ["<mouse 3>", "E"],
        "jump": "<space>",
        "sprint": "<shift>",
        "crouch": ["Z", "<caps-lock>", "\\", "C"],
    }
}



//Prevent Ctrl+S (and Ctrl+W for old browsers and Edge)
document.onkeydown = function (e) {
    e = e || window.event;//Get event

    var code = e.which || e.keyCode //Get key code

    if (!e.ctrlKey) return;


    switch (code) {
        case 220: 
        case 83://Block Ctrl+S
        case 87://Block Ctrl+W -- Not work in Chrome and new Firefox
        case 68: // block Ctrl+D
            e.preventDefault()
            e.stopPropagation()
            break;
    }
};


function makeInputs(noa, opts, element) {
    opts = Object.assign({}, defaultBindings, opts)
    var inputs = createInputs(element, opts)
    var b = opts.bindings
    for (var name in b) {
        var arr = (Array.isArray(b[name])) ? b[name] : [b[name]]
        arr.unshift(name)
        inputs.bind.apply(inputs, arr)
    }
    return inputs
}







/**
 * `noa.inputs` - manages keybinds and mouse input.
 *
 * Extends [andyhall/game-inputs](https://github.com/andyhall/game-inputs),
 * see there for implementation and docs.
 * 
 * By default, the following bindings will be made automatically. 
 * You can undo bindings with `unbind`, or specify your own with a 
 * `bindings` property on the options object passed to the [[Engine]].
 * 
 * ```js
 * var defaultBindings = {
 *     "forward": ["W", "<up>"],
 *     "left": ["A", "<left>"],
 *     "backward": ["S", "<down>"],
 *     "right": ["D", "<right>"],
 *     "fire": "<mouse 1>",
 *     "mid-fire": ["<mouse 2>", "Q"],
 *     "alt-fire": ["<mouse 3>", "E"],
 *     "jump": "<space>",
 *     "sprint": "<shift>",
 *     "crouch": "<control>",
 * }
 * ```
 *
 * @typedef {Object} Inputs
 * @prop {boolean} disabled
 * @prop {Object} state Maps key binding names to input states.
 * @prop {(binding:string, ...keyCodes:string[]) => void} bind Binds one or more keycodes to a binding.
 * @prop {(binding:string) => void} unbind Unbinds all keyCodes from a binding.
 * @prop {import('events').EventEmitter} down Emits input start events (i.e. keyDown).
 * @prop {import('events').EventEmitter} up Emits input end events (i.e. keyUp).
*/


