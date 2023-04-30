/**
 * Controllers for the **\/** route.
 * @memberof module:admin
 * @namespace index
 */

/**
 * **GET /**
 * @memberof module:admin.index
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {
    res.render('home')
}

module.exports = {
    render
}