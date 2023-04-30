/**
 * Controllers for the **\/confirmation** route.
 * @memberof module:ctl
 * @namespace confirmation
 */


/**
 * **GET /confirmation**
 * @memberof module:ctl.confirmation
 * @arg {object} req - Express request object.
 * @arg {object} res - Express response object.
 */
async function render(req, res) {

    if (!req.flash('order-created').shift()) {
        return res.redirect('/')
    }

    return res.render('confirmation')
}


module.exports = {
    render
}