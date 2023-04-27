/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "verification_tokens" table and its associations.
 *
 * @memberof module:db
 * @constructor VerificationToken
 * @hideconstructor
 */


var crypto = require('crypto')


module.exports = function (sequelize, DataTypes) {

    var VerificationToken = sequelize.define('verification_token', {

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.VerificationToken
         * @instance
         */
        text: {
            allowNull : false,
            type      : DataTypes.STRING
        }
    })

    /**
     * @memberof module:db.VerificationToken
     * @arg models - An object with all models as properties.
     */
    VerificationToken.associate = function (models) {

        this.belongsTo(models.User)
    }

    VerificationToken.beforeValidate(async function (token) {

        token.text = crypto.randomBytes(16).toString('hex')
    })

    return VerificationToken
}