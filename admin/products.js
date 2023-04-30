/**
 * Controllers for the **\/products** route.
 * @memberof module:admin
 * @namespace products
 * @see {@link https://nodejs.org/api/fs.html}
 */

var querystring = require('node:querystring')
var path = require('path')
var fs = require('fs')
var util = require('util')
var db = require('../lib/db')
var {Op: {iLike}} = require('sequelize')

/**
 * **GET /products**
 * ~~~js
 * // Supported query parameters:
 * {
 *     search: '...',
 *     order: '...',
 *     category: '...',
 *     manufacturer: '...'
 * }
 * ~~~
 * @memberof module:admin.products
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    res.locals.products      = await db.Product.findAll(build_query(req))
    res.locals.categories    = await db.Category.findAll()
    res.locals.manufacturers = await db.Manufacturer.findAll()
    res.locals.original_url  = req.originalUrl
    res.locals.msg           = req.query.msg
    res.locals.msg_type      = req.query.msg_type

    return res.render('products')

    /* -------------------------------------------------------------------------------------------------------------- */
    function build_query(req) {

        var $search       = req.query.search
        var $order        = req.query.order
        var $category     = req.query.category
        var $manufacturer = req.query.manufacturer

        var where = Object.assign(Object.create(null),
            $search       && {name: {[iLike]: '%' + $search + '%'}},
            $category     && {categoryId: $category},
            $manufacturer && {manufacturerId: $manufacturer}
        )

        var order = (function () {
            switch ($order) {
                case 'cost_asc'  : return [['cost', 'ASC']]
                case 'cost_desc' : return [['cost', 'DESC']]
                default          : return [['name', 'ASC']]
            }
        })()

        var include = [db.Category, db.Manufacturer]

        return {where, order, include}
    }
}

/**
 * **POST /products/create**
 * ~~~js
 * // Supported request body:
 * {
 *     p_name: '...',
 *     p_cost: '...',
 *     p_category: '...',
 *     p_manufacturer: '...',
 *     // + img file handled by the multer middleware.
 *     // + product list manipulation parameters that will be preserved:
 *     search: '...',
 *     order: '...',
 *     category: '...',
 *     manufacturer: '...'
 * }
 * ~~~
 * @see [Express multer middleware]{@link https://expressjs.com/en/resources/middleware/multer.html}
 * @memberof module:admin.products
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function create(req, res) {
    var $file           = req.file
    var $p_name         = req.body.p_name
    var $p_cost         = req.body.p_cost
    var $p_category     = req.body.p_category
    var $p_manufacturer = req.body.p_manufacturer

    var product = await db.Product.create({
        name           : $p_name,
        cost           : $p_cost,
        categoryId     : $p_category,
        manufacturerId : $p_manufacturer
    })

    if ($file) {
        var basedir = path.resolve(__dirname, '..')
        var tempdir = path.join(basedir, $file.path)
        var destdir = path.join(basedir, 'public', 'img', product.id + '.jpg')

        await util.promisify(fs.rename)(tempdir, destdir)

        await product.update({img: product.id + '.jpg'})
    }

    var query = {
        search       : req.body.search,
        order        : req.body.order,
        category     : req.body.category,
        manufacturer : req.body.manufacturer,
        msg_type     : 'is-success',
        msg          : 'Create action successful.'
    }

    return res.redirect('/products?' + querystring.stringify(query))
}

/**
 * **POST /products/update**
 * ~~~js
 * // Supported request body:
 * {
 *     p_id: '...',
 *     p_name: '...',
 *     p_cost: '...',
 *     p_category: '...',
 *     p_manufacturer: '...'
 *     // + img file handled by the multer middleware.
 *     // + product list manipulation parameters that will be preserved:
 *     search: '...',
 *     order: '...',
 *     category: '...',
 *     manufacturer: '...'
 * }
 * ~~~
 * @see [Express multer middleware]{@link https://expressjs.com/en/resources/middleware/multer.html}
 * @memberof module:admin.products
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function update(req, res) {
    var $file           = req.file
    var $p_id           = req.body.p_id
    var $p_name         = req.body.p_name
    var $p_cost         = req.body.p_cost
    var $p_category     = req.body.p_category
    var $p_manufacturer = req.body.p_manufacturer

    var update = Object.assign(Object.create(null),
        $p_name         && {name: $p_name},
        $p_cost         && {cost: $p_cost},
        $p_category     && {categoryId: $p_category},
        $p_manufacturer && {manufacturerId: $p_manufacturer},
        $file           && {img: $p_id + '.jpg'}
    )

    await db.Product.update(update, {where: {id: $p_id}})

    if ($file) {
        var basedir = path.resolve(__dirname, '..')
        var tempdir = path.join(basedir, $file.path)
        var destdir = path.join(basedir, 'public', 'img', $p_id + '.jpg')

        await util.promisify(fs.rename)(tempdir, destdir)
    }

    var query = {
        search       : req.body.search,
        order        : req.body.order,
        category     : req.body.category,
        manufacturer : req.body.manufacturer,
        msg_type     : 'is-success',
        msg          : 'Update action successful.'
    }

    return res.redirect('/products?' + querystring.stringify(query))
}

/**
 * **GET /products/delete**
 * ~~~js
 * // Supported query parameters:
 * {
 *     p_id: '...',
 *     // + product list manipulation parameters that will be preserved:
 *     search: '...',
 *     order: '...',
 *     category: '...',
 *     manufacturer: '...'
 * }
 * ~~~
 * @memberof module:admin.products
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function destroy(req, res) {
    await db.Product.destroy({where: {id: req.query.p_id}})

    var dir = path.resolve(__dirname, '../public/img/' + req.query.p_id + '.jpg')

    fs.rmSync(dir, {force: true})

    var query = {
        search       : req.query.search,
        order        : req.query.order,
        category     : req.query.order,
        manufacturer : req.query.manufacturer,
        msg_type     : 'is-success',
        msg          : 'Delete action successful.'
    }

    return res.redirect('/products?' + querystring.stringify(query))
}

module.exports = {
    render,
    create,
    update,
    destroy
}