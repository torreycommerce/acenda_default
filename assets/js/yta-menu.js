$(document).on( "click", '.yta-toggle', function() {
    $('html').toggleClass('yta-open');
});
$(document).on( "click", '.yta-getsub', function() {
    $(this).parent().toggleClass('active');
});