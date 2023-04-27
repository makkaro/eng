/**
 * ### ctl
 * Controllers.
 * @module ctl
 * @see [express request]{@link https://expressjs.com/en/4x/api.html#req}
 * @see [express response]{@link https://expressjs.com/en/4x/api.html#res}
 * @see [connect-flash]{@link https://www.npmjs.com/package/connect-flash}
 */


var ctl = {
    home     : require('./home'),
    cart     : require('./cart'),
    login    : require('./login'),
    logout   : require('./logout'),
    order    : require('./order'),
    register : require('./register'),
    verify   : require('./verify')
}


module.exports = ctl