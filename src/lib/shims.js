
/**
 * This works around some old node-style code in a
 * dependency of box-intersect.
*/
if (typeof window !== "undefined" && !window['global']) {
    window['global'] = window.globalThis || {}
}

