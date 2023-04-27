/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "cart_items" table and its associations.
 *
 * @memberof module:db
 * @constructor CartItem
 * @hideconstructor
 */


/** */
module.exports = function (sequelize, DataTypes) {

    var CartItem = sequelize.define('cart_item', {

        /**
         * ***INTEGER***
         *
         * @memberof module:db.CartItem
         * @instance
         */
        amount: {
            allowNull    : false,
            defaultValue : 1,
            type         : DataTypes.INTEGER
        }
    })

    return CartItem
}