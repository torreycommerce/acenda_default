// asynced bonus fluff good

IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/device.min.js",function(){
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


$('img').each(function() {
	if ($(this).width() == 0 || $(this).height() == 0) {
		$(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-250x250.gif');	
	}
});
$('img').error(function() {
	$(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-250x250.gif');
});


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