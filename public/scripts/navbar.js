$(document).ready(function () {

    $('.navbar-burger').click(function () {

        $(this).toggleClass('is-active')
        $('.navbar-menu').toggleClass('is-active')
    })

    $('.navbar-item.has-dropdown .navbar-link').click(function () {

        $(this).siblings('.navbar-dropdown').toggleClass('is-hidden-touch')
    })
})