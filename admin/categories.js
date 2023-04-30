/**
 * Controllers for the **\/categories** route.
 * @memberof module:admin
 * @namespace categories
 */

var querystring = require('node:querystring')
var db = require('../lib/db')
var {Op: {iLike}} = require('sequelize')

/**
 * **GET /categories**
 * ~~~js
 * // Supported query parameters:
 * {
 *     search: '...'
 * }
 * @memberof module:admin.categories
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {
    var $search = req.query.search

    res.locals.categories = await db.Category.findAll({
        where: {
            name: {[iLike]: '%' + ($search || '') + '%'}
        },
        order: [['name', 'ASC']]
    })

    res.locals.msg = req.query.msg
    res.locals.msg_type = req.query.msg_type
    res.locals.original_url = req.originalUrl

    return res.render('categories')
}

/**
 * **GET /categories/create**
 * ~~~js
 * // Supported query parameters:
 * {
 *     name: '...',
 *     search: '...'
 * }
 * @memberof module:admin.categories
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function create(req, res) {
    await db.Category.create({name: req.query.name})

    var query = {
        search: req.query.search,
        msg_type: 'is-success',
        msg: 'Create action successful.'
    }

    return res.redirect('/categories?' + querystring.stringify(query))
}

/**
 * **GET /categories/update**
 * ~~~js
 * // Supported query parameters:
 * {
 *     id: '...',
 *     name: '...',
 *     search: '...'
 * }
 * ~~~
 * @memberof module:admin.categories
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function update(req, res) {
    await db.Category.update({name: req.query.name}, {where: {id: req.query.id}})

    var query = {
        search: req.query.search,
        msg_type: 'is-success',
        msg: 'Update action successful.'
    }

    return res.redirect('/categories?' + querystring.stringify(query))
}

/**
 * **GET /categories/delete**
 * ~~~js
 * // Supported query parameters:
 * {
 *     id: '...',
 *     search: '...'
 * }
 * ~~~
 * @memberof module:admin.categories
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function destroy(req, res) {
    var query = {search: req.query.search}

    var category = await db.Category.findByPk(req.query.id)

    if (await category.countProducts()) {
        query.msg_type = 'is-danger'
        query.msg = 'Delete action failed: this category has associated products.'

    } else {
        await category.destroy()
        query.msg_type = 'is-success'
        query.msg = 'Delete action successful.'
    }

    return res.redirect('/categories?' + querystring.stringify(query))
}

module.exports = {
    render,
    create,
    update,
    destroy
}