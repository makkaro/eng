/**
 * Controllers for the **\/** route.
 * @memberof module:ctl
 * @namespace home
 */


var iLike   = require('sequelize').Op.iLike
var toolbox = require('../lib/toolbox')
var db      = require('../lib/db')


/**
 * **GET /**
 * ~~~js
 * // Accepted query parameters for manipulating the product list:
 * {
 *     search: '...',
 *     order: '...',
 *     category: '...',    // May be an array.
 *     manufacturer: '...' // May be an array.
 * }
 * ~~~
 * @memberof module:ctl.home
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    res.locals.added         = await req.flash('added').shift()
    res.locals.categories    = await db.Category.findAll()
    res.locals.manufacturers = await db.Manufacturer.findAll()
    res.locals.products      = await db.Product.findAll(build_query(req))
    res.locals.authenticated = req.session.authenticated
    res.locals.user          = req.session.user
    res.locals.original_url  = req.originalUrl

    return res.render('home')

    /* -------------------------------------------------------------------------------------------------------------- */
    function build_query(req) {

        var $search       = req.query.search
        var $order        = req.query.order
        var $category     = req.query.category
        var $manufacturer = req.query.manufacturer

        var where = Object.assign(Object.create(null),
            $search       && {name: {[iLike]: '%' + $search + '%'}},
            $category     && {categoryId: toolbox.force_array($category)},
            $manufacturer && {manufacturerId: toolbox.force_array($manufacturer)}
        )

        var order = (function () {
            switch ($order) {
                case 'cost_asc'  : return [['cost', 'ASC']]
                case 'cost_desc' : return [['cost', 'DESC']]
                default          : return [['name', 'ASC']]
            }
        })()

        return {where, order}
    }
}


/**
 * **POST /**
 * ```js
 * // Expected request body:
 * {
 *     id: '...'
 * }
 * ```
 * @memberof module:ctl.home
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function add_to_cart(req, res) {

    req.session.authenticated ? await database(req) : cookie(req)

    req.flash('added', 'true')

    return res.redirect('/')

    /* -------------------------------------------------------------------------------------------------------------- */
    async function database (req) {

        var $productId = req.body.id

        var cart = await db.Cart.findOne({where: {userId: req.session.user.id}})

        var [item, created] = await db.CartItem.findOrCreate({where: {productId: $productId, cartId: cart.id}})

        if (!created) {
            await item.update({amount: item.amount + 1})
        }
    }

    /* -------------------------------------------------------------------------------------------------------------- */
    function cookie (req) {

        var $productId = req.body.id

        var $template = req.session.cart_template || Array()

        var item = $template.find(item => item.id == $productId)

        item ? ++item.amount : $template.unshift({id: parseInt($productId), amount: 1})

        req.session.cart_template = $template
    }
}


module.exports = {
    render,
    add_to_cart
}