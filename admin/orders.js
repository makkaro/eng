/**
 * Controllers for the **\/orders** route.
 * @memberof module:admin
 * @namespace orders
 */

var db = require('../lib/db')
var toolbox = require('../lib/toolbox')
var {Op: {gte, lte, iLike}} = require('sequelize')

/**
 * **GET /orders**
 * ~~~js
 * // Supported query parameters for manipulating the order list:
 * {
 *     order: '...',
 *     from: '...',
 *     to: '...',
 *     status: '...',
 *     search: '...',
 *     search_by: '...'
 * }
 * ~~~
 * @memberof module:admin.orders
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {
    var orders = await db.Order.findAll(await build_query(req))

    res.locals.orders = orders.map(order => ({
        id         : order.id,
        status     : order.status,
        user       : order.user.email,
        created_at : toolbox.get_date(order.createdAt.toISOString()),
        updated_at : toolbox.get_date(order.updatedAt.toISOString())
    }))

    res.locals.original_url = req.originalUrl

    return res.render('orders')

    /* -------------------------------------------------------------------------------------------------------------- */
    async function build_query(req) {

        var $order     = req.query.order
        var $from      = req.query.from
        var $to        = req.query.to
        var $status    = req.query.status
        var $search    = req.query.search
        var $search_by = req.query.search_by

        var where   = Object.create(null)
        var include = Object.create(null)
        var order   = Object.create(null)

        if ($from && $to) {
            where.createdAt = {
                [gte]: new Date($from + 'T00:00:00.001Z'),
                [lte]: new Date($to + 'T23:59:59.999Z')
            }
        } else if ($from) {
            where.createdAt = {
                [gte]: new Date($from + 'T00:00:00.001Z')
            }
        } else if ($to) {
            where.createdAt = {
                [lte]: new Date($to + 'T23:59:59.999Z')
            }
        }

        if ($status) {
            where.status = $status
        }

        if ($search && $search_by == 'user') {
            include.where = {email: {[iLike]: '%' + $search + '%'}}
        }

        if ($search && $search_by == 'id' && !isNaN($search)) {
            where.id = $search
        }

        order = (function () {
            switch ($order) {
                case 'updated_at_desc' : return [['updatedAt', 'DESC']]
                default                : return [['createdAt', 'DESC']]
            }
        })()

        include.model = db.User

        return {where, include, order}
    }
}

/**
 * **GET /orders/:id**
 * @memberof module:admin.orders
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render_details(req, res) {
    var order = await db.Order.findByPk(req.params.id, {include: [db.OrderItem, db.User]})

    res.locals.order = {
        id           : order.id,
        status       : order.status,
        user         : order.user.email,
        total        : toolbox.parseUSD(order.order_items.reduce((prev, item) => prev + item.cost * item.amount, 0)),
        created_at   : toolbox.get_date(order.createdAt.toISOString()),
        updated_at   : toolbox.get_date(order.updatedAt.toISOString()),
        created_at_t : toolbox.get_time(order.createdAt.toISOString()),
        updated_at_t : toolbox.get_time(order.updatedAt.toISOString())
    }

    res.locals.order.address = {
        name           : order.first_name + ' ' + order.last_name,
        telephone      : order.telephone,
        street_address : order.street_address,
        city           : order.city,
        postal_code    : order.postal_code
    }

    res.locals.order.items = order.order_items.map(item => ({
        amount   : item.amount,
        cost     : toolbox.parseUSD(item.cost),
        subtotal : toolbox.parseUSD(item.cost * item.amount),
        name     : item.name
    }))

    return res.render('order')
}

/**
 * **POST /orders/:id**
 * ~~~js
 * // Supported request body:
 * {
 *     status: '...'
 * }
 * ~~~
 * @memberof module:admin.orders
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function change_status(req, res) {
    await db.Order.update({status: req.body.status}, {where: {id: req.params.id}})

    return res.redirect('/orders/' + req.params.id)
}

module.exports = {
    render,
    render_details,
    change_status
}