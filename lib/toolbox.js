/**
 * ### toolbox
 * Various utility functions.
 *
 * @module toolbox
 */


/**
 * Wraps a value in an array, if it's not an array already.
 * @memberof module:toolbox
 * @arg {any|Array<any>} val
 * @return {Array<any>}
 */
function force_array(val) {

    return val instanceof Array ? val : [val]
}


module.exports = {force_array}