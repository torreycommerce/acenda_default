// asynced bonus fluff good
IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/device.min.js",function(){
});

IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/accesstabs.js",function(){
    $('.addAccess').each(function() {
        $(this).setup_navigation();
    });
});

$('body').on('mouseenter','.ace-bs-access:not(.show) [data-toggle=dropdown]',function(e){
    $(this).addClass('ace-bs-accessed').dropdown('toggle');
});
$('body').on('mouseleave','.ace-bs-access.dropdown',function(e){
    if ($(this).hasClass('show')) {
        $(this).find('.ace-bs-accessed[data-toggle=dropdown]').dropdown('toggle');
    }
    $(this).find('.ace-bs-accessed[data-toggle=dropdown]').removeClass('ace-bs-accessed');
});

// https://github.com/twbs/bootstrap/issues/14040
// TODO: Add any custom classes with 'position: fixed' to the selector below
var fixedCls = '.navbar-fixed-top,.navbar-fixed-bottom,.mobile.yta-open';
var oldSSB = $.fn.modal.Constructor.prototype.setScrollbar;
$.fn.modal.Constructor.prototype.setScrollbar = function () {
    oldSSB.apply(this);
    if (this.bodyIsOverflowing && this.scrollbarWidth)
        $(fixedCls).css('padding-right', this.scrollbarWidth);
}

var oldRSB = $.fn.modal.Constructor.prototype.resetScrollbar;
$.fn.modal.Constructor.prototype.resetScrollbar = function () {
    oldRSB.apply(this);
    $(fixedCls).css('padding-right','');
}

$('html').on("click", ".ttc", function() {
    if ($(this).attr('href')) {
        var ttc = $(this).attr('href');
        if ($(ttc).attr('role','tab')) $(ttc).click();
        $('body,html').animate({
            scrollTop: $(ttc).offset().top
        }, 300);
        return false;
    }
});

$(window).scroll(function () {
    if ($(window).scrollTop() > 1) {
        $('html').addClass('scrolled');
    } else {
        $('html').removeClass('scrolled');
    }
});