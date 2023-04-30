/**
 * Controllers for the **\/manufacturers** route.
 * @memberof module:admin
 * @namespace manufacturers
 */

var querystring = require('node:querystring')
var db = require('../lib/db')
var {Op: {iLike}} = require('sequelize')

/**
 * **GET /manufacturers**
 * ~~~js
 * // Supported query parameters
 * {
 *     search: '...'
 * }
 * @memberof module:admin.manufacturers
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {
    var $search = req.query.search

    res.locals.manufacturers = await db.Manufacturer.findAll({
        where: {
            name: {[iLike]: '%' + ($search || '') + '%'}
        },
        order: [['name', 'ASC']]
    })

    res.locals.msg = req.query.msg
    res.locals.msg_type = req.query.msg_type
    res.locals.originial_url = req.originalUrl

    return res.render('manufacturers')
}

/**
 * **GET /manufacturers/create**
 * ~~~js
 * // Supported query parameters:
 * {
 *     name: '...',
 *     search: '...'
 * }
 * @memberof module:admin.manufacturers
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function create(req, res) {
    await db.Manufacturer.create({name: req.query.name})

    var query = {
        search: req.query.search,
        msg_type: 'is-success',
        msg: 'Create action successful.'
    }

    return res.redirect('/manufacturers?' + querystring.stringify(query))
}

/**
 * **GET /manufacturers/update**
 * ~~~js
 * // Supported query parameters:
 * {
 *     id: '...',
 *     name: '...',
 *     search: '...'
 * }
 * ~~~
 * @memberof module:admin.manufacturers
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function update(req, res) {
    await db.Manufacturer.update({name: req.query.name}, {where: {id: req.query.id}})

    var query = {
        search: req.query.search,
        msg_type: 'is-success',
        msg: 'Update action successful.'
    }

    return res.redirect('/manufacturers?' + querystring.stringify(query))
}

/**
 * **GET /manufacturers/delete**
 * ~~~js
 * // Supported query parameters:
 * {
 *     id: '...',
 *     search: '...'
 * }
 * ~~~
 * @memberof module:admin.manufacturers
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function destroy(req, res) {
    var query = {search: req.query.search}

    var manufacturer = await db.Manufacturer.findByPk(req.query.id)

    if (await manufacturer.countProducts()) {
        query.msg_type = 'is-danger'
        query.msg = 'Delete action failed: this manufacturer has associated products.'

    } else {
        await manufacturer.destroy()
        query.msg_type = 'is-success'
        query.msg = 'Delete action successful.'
    }

    return res.redirect('/manufacturers?' + querystring.stringify(query))
}

module.exports = {
    render,
    create,
    update,
    destroy
}