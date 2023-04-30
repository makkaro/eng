$('.modal-background, .modal-close, .modal-content .button, .__modal-cancel').click(function () {

    $('.modal').removeClass('is-active')
})


$(document).keydown(function (event) {

    if (event.keyCode == 27) {
        $('.modal').removeClass('is-active')
    }
})