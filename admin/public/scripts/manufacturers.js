$(document).ready(function () {

    $('.__modal-trigger').click(function () {
        populate_modal($(this))
    })
})

function populate_modal($el) {
    if ($el.hasClass('__modal-new')) {
        $('#modal-form').attr('action', '/manufacturers/create')
        $('#modal-title').text('Adding new manufacturer...')
        $('#modal-input-id').attr('disabled', true)

    } else {
        var id = $el.find('.__id').text()
        var name = $el.find('.__name').text()
        $('#modal-title').text('Editing category #' + id + '...')
        $('#modal-input-id').val(id)
        $('#modal-input-name').val(name)
    }
}