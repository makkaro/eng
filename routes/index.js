/**
 * ### routes
 * Routes setup.
 * @module routes
 * @see {@link https://expressjs.com/en/4x/api.html#router}
 */


var router = require('express').Router()
var body = require('express-validator').body
var ctl = require('../ctl')
var toolbox = require('../lib/toolbox')


router.route('/')
    .get(ctl.home.render)
    .post(ctl.home.add_to_cart)


router.route('/cart')
    .get(ctl.cart.render)


router.route('/cart/update')
    .get(ctl.cart.update)


router.route('/cart/delete')
    .get(ctl.cart.destroy)


router.route('/confirmation')
    .get(ctl.confirmation.render)


router.route('/login')
    .get(ctl.login.render)
    .post(body('email').isEmail().normalizeEmail(), ctl.login.login)


router.route('/logout')
    .get(ctl.logout.logout)


router.route('/order')
    .all(toolbox.redirect_unauthenticated)
    .get(ctl.order.render)
    .post(
        body('first_name').isAlpha('pl-PL').trim(),
        body('last_name').isAlpha('pl-PL').trim(),
        body('telephone').isMobilePhone('pl-PL'),
        body('street_address').isAlphanumeric('pl-PL', {ignore: ' ./'}).trim(),
        body('city').isAlpha('pl-PL', {ignore: ' -'}).trim(),
        body('postal_code').isPostalCode('PL'),
        ctl.order.order
    )


router.route('/register')
    .get(ctl.register.render)
    .post(body('email').isEmail().normalizeEmail(), ctl.register.register)


router.route('/verify')
    .get(ctl.verify.render)


router.route('/verify/:id/:token')
    .get(ctl.verify.verify)


module.exports = router