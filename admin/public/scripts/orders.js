$(document).ready(function () {

    $('form').submit(function () {
        var $search = $(this).find(':input[type="search"]')
        if (!$search.val()) {
            $search.attr('disabled', true)
            $(this).find(':input[name="search_by"]').attr('disabled', true)
        }
        var $order = $(this).find(':input[name="order"]')
        if ($order.val() == 'created_at_desc') {
            $order.attr('disabled', true)
        }
        var $status = $(this).find(':input[name="status"]')
        if ($status.val() == 'all') {
            $status.attr('disabled', true)
        }
        var $from = $(this).find(':input[name="from"]')
        if (!$from.val()) {
            $from.attr('disabled', true)
        }
        var $to = $(this).find(':input[name="to"]')
        if (!$to.val()) {
            $to.attr('disabled', true)
        }
    })
})