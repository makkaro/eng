require('dotenv').config()
require('express-async-errors')
var express = require('express')
var multer = require('multer')
var path = require('path')
var db = require('../lib/db')
var adminctl = require('../admin')

var upload = multer({dest: 'public/img'})
var __rootdir = path.resolve(__dirname, '..')
var server = express()

server.set('views', './admin/views')
server.set('view engine', 'pug')

server.use(express.urlencoded({extended: true}))
server.use(express.json())
server.use(express.static(path.join(__rootdir, 'node_modules/jquery/dist')))
server.use(express.static(path.join(__rootdir, 'node_modules/bootstrap-icons/font')))
server.use(express.static(path.join(__rootdir, 'node_modules/bulma/css')))
server.use(express.static(path.join(__rootdir, 'public/img')))
server.use(express.static(path.join(__rootdir, 'admin/public/scripts')))

server.get('/', adminctl.home.render)
server.get('/categories', adminctl.categories.render)
server.get('/categories/create', adminctl.categories.create)
server.get('/categories/update', adminctl.categories.update)
server.get('/categories/delete', adminctl.categories.destroy)
server.get('/manufacturers', adminctl.manufacturers.render)
server.get('/manufacturers/create', adminctl.manufacturers.create)
server.get('/manufacturers/update', adminctl.manufacturers.update)
server.get('/manufacturers/delete', adminctl.manufacturers.destroy)
server.get('/orders', adminctl.orders.render)
server.get('/orders/:id', adminctl.orders.render_details)
server.get('/products', adminctl.products.render)
server.get('/products/delete', adminctl.products.destroy)

server.post('/orders/:id', adminctl.orders.change_status)
server.post('/products/create', upload.single('p_img'), adminctl.products.create)
server.post('/products/update', upload.single('p_img'), adminctl.products.update)

;(async function () {
    await db.sequelize.sync()

    server.listen(process.env.ADMINPORT, function () {
        console.info('Server is listening on port %s...', process.env.ADMINPORT)
    })
})()