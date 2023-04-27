/**
 * Controllers for the **\/verify** route.
 * @memberof module:ctl
 * @namespace verify
 */


var db = require('../lib/db')


/**
 * **GET /verify**
 * @memberof module:ctl.verify
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    res.locals.status = req.flash('status').shift()

    return res.render('verify')
}


/**
 * **GET /login/:id/:token**
 * @memberof module:ctl.login
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function verify(req, res) {

    var status = await (async function () {

        var $userId = req.params.id
        var $text   = req.params.token

        var token = await db.VerificationToken.findOne({where: {userId: $userId, text: $text}})

        if (!token) {
            return 'bad-request'
        }

        var user = await db.User.findByPk($userId)

        if (!user) {
            return 'bad-request'
        }

        if (user.verified) {
            return 'already-verified'
        }

        var verified = await db.User.update({verified: true}, {where: {id: $userId}})

        if (!verified) {
            return 'server-error'
        }

        return 'success'
    })()

    req.flash('status', status)

    return res.redirect('/verify')
}


module.exports = {
    render,
    verify
}