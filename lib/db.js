/**
 * ### db
 * Database setup.
 *
 * @module db
 * @return An object with Sequelize constructor, Sequelize instance and all models as properties.
 * @see [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize)
 * @see [Model](https://sequelize.org/api/v6/class/src/model.js~model)
 * @example
 * var db = require('./path/to/this/module')
 *
 * var orders = await db.Order.findAll()
 * // etc.
 */


var db = (function () {

    var {Sequelize, DataTypes} = require('sequelize')

    var sequelize = new Sequelize({
        username : process.env.PGUSER,
        password : process.env.PGPASSWORD,
        host     : process.env.PGHOST,
        database : process.env.PGDATABASE,
        dialect  : 'postgres',
        logging  : false,
        define   : {underscored: true}
    })

    var models = {
        Cart              : require('../models/cart')(sequelize, DataTypes),
        CartItem          : require('../models/cart-item')(sequelize, DataTypes),
        Category          : require('../models/category')(sequelize, DataTypes),
        Manufacturer      : require('../models/manufacturer')(sequelize, DataTypes),
        Order             : require('../models/order')(sequelize, DataTypes),
        OrderItem         : require('../models/order-item')(sequelize, DataTypes),
        Product           : require('../models/product')(sequelize, DataTypes),
        User              : require('../models/user')(sequelize, DataTypes),
        VerificationToken : require('../models/verification-token')(sequelize, DataTypes)
    }

    Object.values(models).forEach(model => model.associate?.(models))

    return {Sequelize, sequelize, ...models}
})()


module.exports = db