$(document).ready(function () {

    $('#menu-trigger-touch, .menu-overlay').click(function () {

        var $overlay = $('.menu-overlay')

        if ($overlay.hasClass('is-active')) {
            $overlay.animate({'opacity': 0}, 'fast', function () {

                $overlay.hide().toggleClass('is-active')
            })
        } else {
            $overlay.show().animate({'opacity': 0.8}, 'fast', function () {

                $overlay.toggleClass('is-active')
            })
        }

        var $wrapper = $('.menu-wrapper')
        var left = $wrapper.hasClass('is-active') ? '-15rem' : 0

        $wrapper.animate({left}, 'fast', function () {

            $wrapper.toggleClass('is-active')
        })
    })


    $('#menu-form :input[data-trigger]').click(function () {

        $('#menu-form').submit()
    })


    $('#menu-form').submit(function () {

        var $search = $(this).find(':input[type="search"]')

        if (!$search.val()) $search.attr('disabled', true)

        $(this).find(':input[value=""]').attr('disabled', true)
    })


    $('.card .is-relative').hover(
        function () {

            $(this).find('.button').removeClass('is-hidden-desktop')
        }, function () {

            $(this).find('.button').addClass('is-hidden-desktop')
        }
    )


    $('.modal-background, .modal-close, .modal-content .button').click(function () {

        $('.modal').removeClass('is-active')
    })


    $(document).keydown(function (event) {

        if (event.keyCode == 27) {
            $('.modal').removeClass('is-active')
        }
    })
})