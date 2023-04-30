$(document).ready(function () {

    $('#options-form').submit(function () {
        var $search = $(this).find(':input[name="search"]')
        if (!$search.val()) {
            $search.attr('disabled', true)
        }
        var $order = $(this).find(':input[name="order"]')
        if ($order.val() == 'name_asc') {
            $order.attr('disabled', true)
        }
        var $category = $(this).find(':input[name="category"]')
        if ($category.val() == 'all') {
            $category.attr('disabled', true)
        }
        var $manufacturer = $(this).find(':input[name="manufacturer"]')
        if ($manufacturer.val() == 'all') {
            $manufacturer.attr('disabled', true)
        }
    })

    $('.__modal-trigger').click(function () {
        populate_modal($(this))
    })

    $('#modal-form input:file').change(function () {
        var files = $(this).prop('files')
        if (files.length) {
            $('#modal-form .file-name').text(files[0].name)
        }
    })
})

function populate_modal($el) {
    if ($el.hasClass('__modal-new')) {
        $('#modal-form').attr('action', '/products/create')
        $('#modal-title').text('Adding new product...')
        $('#modal-input-id').attr('disabled', true)
        $('#modal-form .file-name').text('default.jpg')
    } else {
        var id = $el.find('.__id').text()
        var name = $el.find('.__name').text()
        var cost = $el.find('.__cost').text()
        var category = $el.find('.__category').text()
        var manufacturer = $el.find('.__manufacturer').text()
        var img = $el.find('.__img').text()

        $('#modal-title').text('Editing product #' + id + '...')
        $('#modal-input-id').val(id)
        $('#modal-input-name').val(name)
        $('#modal-input-cost').val(cost)
        $('#modal-input-category').val(category)
        $('#modal-input-manufacturer').val(manufacturer)
        $('#modal-form .file-name').text(img)
    }
}