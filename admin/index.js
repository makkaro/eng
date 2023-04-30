/**
 * ### admin
 * Controllers for the admin panel.
 * @module admin
 * @see [Express request]{@link https://expressjs.com/en/4x/api.html#req}
 * @see [Express response]{@link https://expressjs.com/en/4x/api.html#res}
 */

var admin = {
    home          : require('./home'),
    orders        : require('./orders'),
    products      : require('./products'),
    categories    : require('./categories'),
    manufacturers : require('./manufacturers')
}

module.exports = admin