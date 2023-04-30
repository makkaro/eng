/**
 * Controllers for the **\/register** route.
 * @memberof module:ctl
 * @namespace register
 */


var errors = require('express-validator').validationResult
var db = require('../lib/db')
var mail = require('../lib/mail')
var crypto = require('crypto')


/**
 * **GET /register**
 * @memberof module:ctl.register
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    res.locals.status = req.flash('status').shift()

    return res.render('register')
}


/**
 * **POST /register**
 * ~~~js
 * // Expected request body:
 * {
 *     email: '...',
 *     password: '...'
 * }
 * ~~~
 * @memberof module:ctl.register
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function register(req, res) {

    var {status} = await create_user(req)

    req.flash('status', status)

    return res.redirect('/register')

    /* -------------------------------------------------------------------------------------------------------------- */
    async function create_user(req) {

        var $email    = req.body.email
        var $password = req.body.password

        if (!errors(req).isEmpty()) {
            return {status: 'bad-request'}
        }

        if (await db.User.findOne({where: {email: $email}})) {
            return {status: 'conflict'}
        }

        var user = await db.User.create({email: $email, password: $password})

        if (!user) {
            return {status: 'server-error'}
        }

        var token = await db.VerificationToken.create({
            userId: user.id,
            text: crypto.randomBytes(16).toString('hex')
        })

        if (!token) {
            return {status: 'server-error'}
        }

        void await mail({
            from    : 'no-reply@test.com',
            to      : `${user.email}`,
            subject : 'E-mail address verification',
            text    : `Verification url: http://localhost:3000/verify/${user.id}/${token.text}`
        })

        return {status: 'success'}
    }
}


module.exports = {
    render,
    register
}