$('#yta-menu').before('<div class="yta-mask yta-toggle"></div>').prepend('<div class="yta-head yta-bg"><button class="btn btn-lg btn-white btn-sq-lg pull-right yta-toggle"><i class="fa fa-close"><i class="sr-only">Close</i></i></button></div>');
$(document).on( "click", '.yta-toggle', function() {
    $('html').toggleClass('yta-open');
    return false;
});
$(document).on( "click", '.yta-getsub', function() {
    $(this).parent().toggleClass('active');
});