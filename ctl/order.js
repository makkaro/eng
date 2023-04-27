/**
 * Controllers for the **\/order** route.
 * @memberof module:ctl
 * @namespace order
 */


var db = require('../lib/db')


/**
 * **GET /order**
 * @memberof module:ctl.order
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    return res.render('order')
}


/**
 *
 * @memberof module:ctl.order
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function order(req, res) {

    console.log(req.body)
}


module.exports = {
    render,
    order
}