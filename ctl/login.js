/**
 * Controllers for the **\/login** route.
 * @memberof module:ctl
 * @namespace login
 */


var errors = require('express-validator').validationResult
var db = require('../lib/db')


/**
 * **GET /login**
 * @memberof module:ctl.login
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    res.locals.status = req.flash('status').shift()

    return res.render('login')
}


/**
 * **POST /login**
 * ~~~js
 * // Expected request body:
 * {
 *     email: '...',
 *     password: '...'
 * }
 * ~~~
 * @memberof module:ctl.login
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function login(req, res) {

    var {status, user} = await auth(req)

    if (status) {
        req.flash('status', status)

        return res.redirect('/login')
    }

    await init_cart(req, user.id)

    req.session.authenticated = true
    req.session.user          = {id: user.id, email: user.email}

    return res.redirect('/')

    /* -------------------------------------------------------------------------------------------------------------- */
    async function auth(req) {

        var $email    = req.body.email
        var $password = req.body.password

        if (!errors(req).isEmpty()) {
            return {status: 'bad-request', user: null}
        }

        var user = await db.User.scope('full').findOne({where: {email: $email}})

        if (!user) {
            return {status: 'bad-request', user: null}
        }

        if (!user.verified) {
            return {status: 'not-verified', user: null}
        }

        var authenticated = await user.authenticate($password)

        if (!authenticated) {
            return {status: 'bad-request', user: null}
        }

        return {status: null, user}
    }

    /* -------------------------------------------------------------------------------------------------------------- */
    async function init_cart(req, userId) {

        var [cart, created] = await db.Cart.findOrCreate({where: {userId}})

        var empty = created || !(await cart.countProducts())

        var $template = req.session.cart_template

        if (empty && $template) {
            for (var item of $template) {
                await db.CartItem.create({amount: item.amount, productId: item.id, cartId: cart.id})
            }

            delete req.session.cart_template
        }
    }
}


module.exports = {
    render,
    login
}