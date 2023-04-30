/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "orders" table and its associations.
 *
 * @memberof module:db
 * @constructor Order
 * @hideconstructor
 */


/** */
module.exports = function (sequelize, DataTypes) {

    var Order = sequelize.define('order', {

        /**
         * ***ENUM***
         *
         * @memberof module:db.Order
         * @instance
         */
        status: {
            allowNull    : false,
            defaultValue : 'NEW',
            type         : DataTypes.ENUM('NEW', 'PAID', 'FINALIZED', 'CANCELED')
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Order
         * @instance
         */
        first_name: {
            allowNull    : false,
            type         : DataTypes.STRING
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Order
         * @instance
         */
        last_name: {
            allowNull    : false,
            type         : DataTypes.STRING
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Order
         * @instance
         */
        telephone: {
            allowNull    : false,
            type         : DataTypes.STRING
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Order
         * @instance
         */
        street_address: {
            allowNull    : false,
            type         : DataTypes.STRING
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Order
         * @instance
         */
        city: {
            allowNull    : false,
            type         : DataTypes.STRING
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Order
         * @instance
         */
        postal_code: {
            allowNull    : false,
            type         : DataTypes.STRING
        }
    })

    /**
     * @memberof module:db.Order
     * @arg models - An object with all models as properties.
     */
    Order.associate = function (models) {

        this.belongsTo(models.User)
        this.hasMany(models.OrderItem)
    }

    return Order
}