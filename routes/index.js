/**
 * ### routes
 * Routes setup.
 * @module routes
 * @see {@link https://expressjs.com/en/4x/api.html#router}
 */


var router = require('express').Router()
var body = require('express-validator').body
var ctl = require('../ctl')


router.route('/')
    .get(ctl.home.render)
    .post(ctl.home.add_to_cart)


router.route('/cart')
    .get(ctl.cart.render)


router.route('/cart/update')
    .get(ctl.cart.update)


router.route('/cart/delete')
    .get(ctl.cart.destroy)


router.route('/login')
    .get(ctl.login.render)
    .post(body('email').isEmail().normalizeEmail(), ctl.login.login)


router.route('/logout')
    .get(ctl.logout.logout)


router.route('/order')
    .get(ctl.order.render)
    .post(ctl.order.order)


router.route('/register')
    .get(ctl.register.render)
    .post(body('email').isEmail().normalizeEmail(), ctl.register.register)


router.route('/verify')
    .get(ctl.verify.render)


router.route('/verify/:id/:token')
    .get(ctl.verify.verify)


module.exports = router