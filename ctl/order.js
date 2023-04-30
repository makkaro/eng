/**
 * Controllers for the **\/order** route.
 * @memberof module:ctl
 * @namespace order
 */


var validationResult = require('express-validator').validationResult
var db = require('../lib/db')
var mail = require('../lib/mail')
var toolbox = require('../lib/toolbox')


/**
 * **GET /order**
 * @memberof module:ctl.order
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    res.locals.data = JSON.parse(req.flash('data').shift() || null)
    res.locals.errors = req.flash('error')
    res.locals.authenticated = req.session.authenticated
    res.locals.user = req.session.user

    return res.render('order')
}


/**
 *
 * @memberof module:ctl.order
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function order(req, res) {

    var errors = validationResult(req)

    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.path))

        req.flash('data', JSON.stringify(req.body))

        return res.redirect('/order')
    }

    var [cart, order] = await Promise.all([
        db.Cart.findOne({where: {userId: req.session.user.id}, include: db.Product}),
        db.Order.create({userId: req.session.user.id, ...req.body})
    ])

    var items = cart.products.map(function ({cost, name, cart_item: {amount}}) {
        return {cost, name, amount}
    })

    for (var item of items) {
        await db.OrderItem.create({orderId: order.id, ...item})
    }

    var total = items.reduce((prev, item) => prev + item.cost * item.amount, 0)

    void await mail({
        from    : 'no-reply@test.com',
        to      : `${req.session.user.email}`,
        subject : `Order #${order.id}`,
        text    : `
            Order #${order.id} created.
            Payment data:
                Amount: ${toolbox.parseUSD(total)}
                Account number: ${process.env.BANKNUMBER}
                Title: #${order.id}
        `
    })

    req.flash('order-created', 'true')

    return res.redirect('/confirmation')
}


module.exports = {
    render,
    order
}