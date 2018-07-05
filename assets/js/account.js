$(document).ready(function() { 
   $('[data-tooltip]').tooltip();
    if ($('.multi-select:checked').length > 0) {
        $('#actions').show();
    } else {
        $('#actions').hide();
    }
    if ($('form[name=address]').length) {
        $('form[name=address]').attachNormalizer();
    }
});

$('tbody tr input:checkbox').click(function(e) {
    e.stopPropagation();
    if ($('.multi-select:checked').length > 0) {
        $('#actions').show();
    } else {
        $('#actions').hide();
    }
});

$('.btn-delete').click(function(e) {
    e.preventDefault();
    var selected = new Array();
    $('.multi-select:checked').each(function() {
        selected.push(this.name);
    });
    $.post($('#item_link').val().replace('{id}','') + 'multidelete.html', {'multi[]': selected})
    .always(function() {
        location.reload();
    });
});

$('select.form-control-autosubmit').change(function(){
    $(this).closest('form').submit();
});