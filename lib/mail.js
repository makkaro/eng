/**
 * ### mail
 * E-mail setup.
 *
 * @module mail
 * @see {@link https://nodemailer.com/usage/#sending-mail}
 * @example
 * var mail = require('./mail')
 *
 * var info = await mail({
 *     from    : 'test@test.com'
 *     to      : 'test@test.com'
 *     subject : 'Test'
 *     text    : 'Test.'
 * })
 */


var nodemailer = require('nodemailer')


async function mail(data) {

    var transporter = nodemailer.createTransport({
        host     : process.env.MAILHOST,
        port     : process.env.MAILPORT,
        secure   : false,
        auth: {
            user : process.env.MAILUSER,
            pass : process.env.MAILPASS
        }
    })

    return await transporter.sendMail(data)
}


module.exports = mail