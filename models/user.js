/**
 * A wrapper for the [sequelize model](https://sequelize.org/api/v6/class/src/model.js~model).
 * Defines "users" table and its associations.
 *
 * @memberof module:db
 * @constructor User
 * @hideconstructor
 */


var crypto = require('crypto')
var util = require('util')


module.exports = function (sequelize, DataTypes) {

    var User = sequelize.define('user', {

        /**
         * ***VARCHAR(255)***
         *
         * @memberof module:db.User
         * @instance
         */
        email: {
            allowNull    : false,
            type         : DataTypes.STRING
        },

        /**
         * ***BYTEA***
         *
         * @memberof module:db.User
         * @instance
         */
        password: {
            allowNull    : false,
            type         : DataTypes.BLOB
        },

        /**
         * ***BYTEA***
         *
         * @memberof module:db.User
         * @instance
         */
        salt: {
            allowNull    : true,
            type         : DataTypes.BLOB
        },

        /**
         * ***TINYINT(1)***
         *
         * @memberof module:db.User
         * @instance
         */
        verified: {
            allowNull    : false,
            defaultValue : false,
            type         : DataTypes.BOOLEAN
        }
    })

    /**
     * @memberof module:db.User
     * @arg models - An object with all models as properties.
     */
    User.associate = function (models) {

        this.hasOne(models.Cart)
        this.hasOne(models.VerificationToken)
        this.hasMany(models.Order)
    }

    /**
     * @function module:db.User#authenticate
     * @arg {string} $password
     * @return {boolean} **true** if authentication was successful, otherwise **false**.
     */
    User.prototype.authenticate = async function ($password) {

        var hash = await util.promisify(crypto.pbkdf2)($password, this.salt, 310000, 32, 'sha256')

        return crypto.timingSafeEqual(hash, this.password)
    }

    User.beforeCreate(async function (user) {

        user.salt = crypto.randomBytes(16)
        user.password = await util.promisify(crypto.pbkdf2)(user.password, user.salt, 310000, 32, 'sha256')
    })

    User.addScope('defaultScope', {
        attributes: {
            exclude: ['password', 'salt']
        }
    })

    User.addScope('full', {})

    return User
}