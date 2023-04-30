/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "products" table and its associations.
 *
 * @memberof module:db
 * @constructor Product
 * @hideconstructor
 */


/** */
module.exports = function (sequelize, DataTypes) {

    var Product = sequelize.define('product', {

        /**
         * ***INTEGER***
         *
         * @memberof module:db.Product
         * @instance
         */
        cost: {
            allowNull    : false,
            type         : DataTypes.INTEGER
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Product
         * @instance
         */
        img: {
            allowNull    : false,
            defaultValue : 'default.jpg',
            type         : DataTypes.STRING
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Product
         * @instance
         */
        name: {
            allowNull    : false,
            type         : DataTypes.STRING
        }
    })

    /**
     * @memberof module:db.Product
     * @arg models - An object with all models as properties.
     */
    Product.associate = function (models) {

        this.belongsTo(models.Category)
        this.belongsTo(models.Manufacturer)
        this.belongsToMany(models.Cart, {through: models.CartItem})
    }

    return Product
}