require('dotenv').config()
require('express-async-errors')

var express         = require('express')
var express_session = require('express-session')
var connect         = require('connect-session-sequelize')
var flash           = require('connect-flash')
var path            = require('path')
var db              = require('../lib/db')
var routes          = require('../routes')


var session = express_session({
    cookie: {
        maxAge        : 43200000,
        sameSite      : true,
        secure        : false
    },
    secret            : process.env.SECRET,
    saveUninitialized : false,
    resave            : false,
    store             : new (connect(express_session.Store))({db: db.sequelize})
})


var server = express()


server.set('view engine', 'pug')


server.use(express.urlencoded({extended: true}))
server.use(express.json())
server.use(session)
server.use(flash())
server.use(express.static(path.join(path.resolve(__dirname, '..'), 'node_modules/jquery/dist')))
server.use(express.static(path.join(path.resolve(__dirname, '..'), 'node_modules/bootstrap-icons/font')))
server.use(express.static(path.join(path.resolve(__dirname, '..'), 'node_modules/bulma/css')))
server.use(express.static(path.join(path.resolve(__dirname, '..'), 'public/img')))
server.use(express.static(path.join(path.resolve(__dirname, '..'), 'public/scripts')))
server.use(express.static(path.join(path.resolve(__dirname, '..'), 'public/style')))
server.use('/', routes)


;(async function () {

    await db.sequelize.sync()

    server.listen(process.env.PORT, function () {
        console.info('URL: http://localhost:%s/', process.env.PORT)
        console.info('Server is listening on port %s...', process.env.PORT)
    })
})()