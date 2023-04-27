/**
 * Controllers for the **\/logout** route.
 * @memberof module:ctl
 * @namespace logout
 */


var util = require('util')


/**
 * **GET /logout**
 * @memberof module:ctl.logout
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function logout(req, res) {

    await util.promisify(req.session.destroy).call(req.session)

    return res.redirect('/')
}


module.exports = {
    logout
}