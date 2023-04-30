$(document).ready(function () {
    purge.call(location)

    $('.notification .delete').click(function () {
        delete_notification($(this).parent())
    })

    $('.__modal-trigger').click(function () {
        activate($('#modal'))
    })

    $('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').click(function () {
        deactivate($('#modal'))
    })
})

function purge() {
    var regex = /([?&]).*=(&|$)/g

    if (regex.test(this.href)) {
        history.replaceState(null, null, this.href.replaceAll(regex, '$1'))
    }
}

function activate($el) {
    $el.addClass('is-active')
}

function deactivate($el) {
    $el.removeClass('is-active')
}

function delete_notification($el) {
    with ({params: new URLSearchParams(location.search)}) {
        params.delete('msg')
        params.delete('msg_type')
        history.replaceState(
            null,
            null,
            location.origin + location.pathname + '?' + params.toString()
        )
    }
    $el.remove()
}