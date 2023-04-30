/**
 * ### toolbox
 * Various utility functions.
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

/**
 * Converts an integer value of US cents to a string representing it in USD.
 * @memberof module:toolbox
 * @arg {number} val - Integer value.
 * @return {string} Value formatted as USD.
 */
function parseUSD(val) {
    return '$ ' + val.toString().replace(/\d{2}$/, '.$&')
}

/**
 * @memberof module:toolbox
 * @arg {string} str - Date in ISO string format - *YYYY-MM-DDTHH:mm:ss:sssZ*
 * @return {string} Date in format *YYYY-MM-DD*
 */
function get_date(str) {
    return /[^T]*/.exec(str).shift()
}

/**
 * @memberof module:toolbox
 * @arg {string} str - Date in ISO string format - *YYYY-MM-DDTHH:mm:ss:sssZ*
 * @return {string} Time in format *HH:mm*
 */
function get_time(str) {
    return /\d*:\d*/.exec(str).shift()
}

/**
 * Gets the value of a search parameter.
 * @memberof module:toolbox
 * @arg {string} key - Name of the parameter.
 * @arg {string} url
 * @return {string} Value of the parameter or an empty string.
 */
function search_val(key, url) {
    var regex = new RegExp(`${key}=([^&]*)`)

    return regex.test(url) ? regex.exec(url)[1] : ''
}

/**
 * Middleware function that redirects unauthenticated requests to the login page.
 * @memberof module:toolbox
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 * @arg {function} next - Callback.
 */
function redirect_unauthenticated(req, res, next) {

    if (!req.session.authenticated) {
        return res.redirect('/login')
    }

    next()
}

module.exports = {
    force_array,
    parseUSD,
    get_date,
    get_time,
    search_val,
    redirect_unauthenticated
}