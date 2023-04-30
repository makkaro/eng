/**
 * Controllers for the **\/cart** route.
 * @memberof module:ctl
 * @namespace cart
 */


var db = require('../lib/db')


/**
 * **GET /cart**
 * @memberof module:ctl.cart
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    var $authenticated = req.session.authenticated

    var cart_items = $authenticated ? await database(req) : await cookie(req)

    var total = cart_items?.reduce((prev, item) => prev + item.subtotal, 0)

    res.locals.cart_items    = cart_items
    res.locals.total         = total
    res.locals.authenticated = $authenticated
    res.locals.user          = req.session.user

    return res.render('cart')

    /* -------------------------------------------------------------------------------------------------------------- */
    async function database(req) {

        var $userId = req.session.user.id

        var {products} = await db.Cart.findOne({
            where: {
                userId: $userId
            },
            include: db.Product,
            order: [
                [db.Product, 'name', 'ASC']
            ]
        })

        if (!products?.length) return null

        return products.map(function (product) {

            var {id, cost, img, name, cart_item: {amount}} = product

            var subtotal = cost * amount

            return {id, cost, img, name, amount, subtotal}
        })
    }

    /* -------------------------------------------------------------------------------------------------------------- */
    async function cookie(req) {

        var $template = req.session.cart_template

        if (!$template?.length) return null

        var products = await db.Product.findAll({
            where: {
                id: $template.map(item => item.id)
            },
            order: [
                ['name', 'ASC']
            ]
        })

        return products.map(function (product) {

            var {id, cost, img, name} = product

            var {amount} = $template.find(item => item.id == id)

            var subtotal = cost * amount

            return {id, cost, img, name, amount, subtotal}
        })
    }
}


/**
 * **GET /cart/update**
 * ~~~js
 * // Expected query parameters:
 * {
 *     id: '...',
 *     amount: '...'
 * }
 * ~~~
 * @memberof module:ctl.cart
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function update(req, res) {

    var $authenticated = req.session.authenticated

    $authenticated ? await database(req) : cookie (req)

    return res.redirect('/cart')

    /* -------------------------------------------------------------------------------------------------------------- */
    async function database(req) {

        var $userId    = req.session.user.id
        var $productId = req.query.id
        var $amount    = req.query.amount

        var {id: $cartId} = await db.Cart.findOne({where: {userId: $userId}})

        await db.CartItem.update({amount: $amount}, {where: {cartId: $cartId, productId: $productId}})
    }

    /* -------------------------------------------------------------------------------------------------------------- */
    function cookie(req) {

        var $template  = req.session.cart_template
        var $productId = req.query.id
        var $amount    = req.query.amount

        if ($template instanceof Array) {
            $template.find(item => item.id == $productId).amount = parseInt($amount)
        }
    }
}


/**
 * **GET /cart/delete**
 * ~~~js
 * // Expected query parameters:
 * {
 *     id: '...'
 * }
 * ~~~
 * @memberof module:ctl.cart
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function destroy(req, res) {

    var $authenticated = req.session.authenticated

    $authenticated ? await database(req) : cookie(req)

    return res.redirect('/cart')

    /* -------------------------------------------------------------------------------------------------------------- */
    async function database(req) {

        var $userId    = req.session.user.id
        var $productId = req.query.id

        var {id: $cartId} = await db.Cart.findOne({where: {userId: $userId}})

        await db.CartItem.destroy({where: {cartId: $cartId, productId: $productId}})
    }

    /* -------------------------------------------------------------------------------------------------------------- */
    function cookie(req) {

        var $template  = req.session.cart_template
        var $productId = req.query.id

        if ($template instanceof Array) {
            req.session.cart_template = $template.filter(item => item.id != $productId)
        }
    }
}


module.exports = {
    render,
    update,
    destroy
}