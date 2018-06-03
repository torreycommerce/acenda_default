// asynced bonus fluff good
IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/device.min.js",function(){
});

IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/accesstabs.js",function(){
    $('.addAccess').each(function() {
        $(this).setup_navigation();
    });
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
    $(fixedCls).css('padding-right', '');
}

$('html').on("click", ".ttc", function() {
    if ($(this).attr('href')) {
        var ttc = $(this).attr('href');
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

$(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {                
            (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
        }

    });
});