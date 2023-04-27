/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "manufacturers" table and its associations.
 *
 * @memberof module:db
 * @constructor Manufacturer
 * @hideconstructor
 */


/** */
module.exports = function (sequelize, DataTypes) {

    var Manufacturer = sequelize.define('manufacturer', {

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Manufacturer
         * @instance
         */
        name: {
            allowNull : false,
            type      : DataTypes.STRING
        }
    })

    /**
     * @memberof module:db.Manufacturer
     * @arg models - An object with all models as properties.
     */
    Manufacturer.associate = function (models) {

        this.hasMany(models.Product)
    }

    return Manufacturer
}