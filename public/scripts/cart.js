$(document).ready(function () {

    $('.update-form select').change(function () {

        $(this).closest('form').submit()
    })
})