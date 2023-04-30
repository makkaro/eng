/**
 * Controllers for the **\/product** route.
 * @memberof module:ctl
 * @namespace product
 */

var db = require('../lib/db')

/**
 * **GET /product/:id**
 * @memberof module:ctl.product
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {
    res.locals.added = req.flash('added').shift()

    res.locals.product = await db.Product.findByPk(req.params.id, {include: db.Manufacturer})

    return res.render('product')
}

/**
 * **POST /product**
 * @memberof module:ctl.product
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function add_to_cart(req, res) {

    req.session.authenticated ? await database(req) : cookie(req)

    req.flash('added', 'true')

    return res.redirect('/product/' + req.body.id)

    /* -------------------------------------------------------------------------------------------------------------- */
    async function database(req) {

        var $productId = req.body.id
        var $amount = req.body.amount

        var cart = await db.Cart.findOne({where: {userId: req.session.user.id}})

        var [item, created] = await db.CartItem.findOrCreate({where: {productId: $productId, cartId: cart.id}})

        if (created) {
            await item.update({amount: parseInt($amount)})
        } else {
            await item.update({amount: item.amount + parseInt($amount)})
        }
    }

    /* -------------------------------------------------------------------------------------------------------------- */
    async function cookie(req) {

        var $productId = req.body.id
        var $amount = req.body.amount

        var $template = req.session.cart_template || Array()

        var item = $template.find(item => item.id == $productId)

        item
            ? item.amount += parseInt($amount)
            : $template.unshift({id: parseInt($productId), amount: parseInt($amount)})

        req.session.cart_template = $template
    }
}

module.exports = {
    render,
    add_to_cart
}