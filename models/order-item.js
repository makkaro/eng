/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "order_items" table and its associations.
 *
 * @memberof module:db
 * @constructor OrderItem
 * @hideconstructor
 */


/** */
module.exports = function (sequelize, DataTypes) {

    var OrderItem = sequelize.define('order_item', {

        /**
         * ***INTEGER***
         *
         * @memberof module:db.OrderItem
         * @instance
         */
        amount: {
            allowNull : false,
            type      : DataTypes.INTEGER
        },

        /**
         * ***INTEGER***
         *
         * @memberof module:db~OrderItem
         * @instance
         */
        cost: {
            allowNull : false,
            type      : DataTypes.INTEGER
        },

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.OrderItem
         * @instance
         */
        name: {
            allowNull : false,
            type      : DataTypes.STRING
        }
    })

    /**
     * @memberof module:db.OrderItem
     * @arg models - An object with all models as properties.
     */
    OrderItem.associate = function (models) {

        this.belongsTo(models.Order)
    }

    return OrderItem
}