require('dotenv').config()


var db = require('../lib/db')


;(async function () {
    await db.sequelize.sync({force: true})

    await db.Category.bulkCreate([
        {name: 'Bottles'},
        {name: 'Candles'},
        {name: 'Pillows'}
    ])

    await db.Manufacturer.bulkCreate([
        {name: 'Bottle-man.'},
        {name: 'Candle-man.'},
        {name: 'Pillow-man.'},
        {name: 'All-man.'}
    ])

    await db.Product.bulkCreate([
        {cost: 199, categoryId: 1, manufacturerId: 1, name: 'Brown Bottle', img: '1.jpg'},
        {cost: 149, categoryId: 1, manufacturerId: 1, name: 'Green Bottle', img: '2.jpg'},
        {cost: 149, categoryId: 1, manufacturerId: 1, name: 'Blue Bottle', img: '3.jpg'},
        {cost: 119, categoryId: 1, manufacturerId: 4, name: 'Transparent Bottle', img: '4.jpg'},
        {cost: 249, categoryId: 2, manufacturerId: 2, name: 'White Candle', img: '5.jpg'},
        {cost: 299, categoryId: 2, manufacturerId: 2, name: 'Pink Candle', img: '6.jpg'},
        {cost: 249, categoryId: 2, manufacturerId: 4, name: 'Red Candle', img: '7.jpg'},
        {cost: 699, categoryId: 3, manufacturerId: 3, name: 'White Pillow', img: '8.jpg'},
        {cost: 799, categoryId: 3, manufacturerId: 3, name: 'Pink Pillow', img: '9.jpg'}
    ])

    await db.User.bulkCreate([
        {email: 'john@test.com', password: 'john', salt: '', verified: true},
        {email: 'jack@test.com', password: 'jack', salt: '', verified: true}
    ], {individualHooks: true})

    await db.Cart.bulkCreate([
        {userId: 1},
        {userId: 2}
    ])
})()
