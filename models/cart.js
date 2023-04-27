/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "carts" table and its associations.
 *
 * @memberof module:db
 * @constructor Cart
 * @hideconstructor
 */


/** */
module.exports = function (sequelize, DataTypes) {

    var Cart = sequelize.define('cart', {})

    /**
     * @memberof module:db.Cart
     * @arg models - An object with all models as properties.
     */
    Cart.associate = function (models) {

        this.belongsTo(models.User)
        this.belongsToMany(models.Product, {through: models.CartItem})
    }

    return Cart
}