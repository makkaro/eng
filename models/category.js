/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "categories" table and its associations.
 *
 * @memberof module:db
 * @constructor Category
 * @hideconstructor
 */


/** */
module.exports = function (sequelize, DataTypes) {

    var Category = sequelize.define('category', {

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.Category
         * @instance
         */
        name: {
            allowNull : false,
            type      : DataTypes.STRING
        }
    })

    /**
     * @memberof module:db.Category
     * @arg models - An object with all models as properties.
     */
    Category.associate = function (models) {

        this.hasMany(models.Product)
    }

    return Category
}