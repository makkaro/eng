require('dotenv').config()


var db = require('../lib/db')


;(async function () {

    await db.sequelize.sync({force: true})

    await db.Category.bulkCreate([
        {name: 'Bottles'},
        {name: 'Candles'}
    ])

    await db.Manufacturer.bulkCreate([
        {name: 'Bottle-man'},
        {name: 'Candle-man'}
    ])

    await db.Product.bulkCreate([
        {cost: 399, categoryId: 1, manufacturerId: 1, name: 'Brown Bottle'},
        {cost: 449, categoryId: 1, manufacturerId: 1, name: 'Green Bottle'},
        {cost: 349, categoryId: 1, manufacturerId: 1, name: 'Blue Bottle' },
        {cost: 799, categoryId: 2, manufacturerId: 2, name: 'White Candle'},
        {cost: 749, categoryId: 2, manufacturerId: 2, name: 'Pink Candle' },
    ])

    await db.User.create({email: 'john@test.com', password: 'john1', verified: true})
})()
