function len(sel) {
	var depth = 0;
	$(sel + " :not(:has(*))").each(function() {
		var tmp = $(this).parentsUntil(sel).length + 1;
		if (tmp > depth) depth = tmp;
	});
	return depth / 2;
}
var depth = len('.yta-body ul:first');
var i = 1;
while (i < depth) {
	//console.log('build body');
	$('.yta-bodies').append('<div class="yta-body bgg frame deep" data-depth="'+i+'"><div class="yta-par"><button class="btn btn-lg btn-blank yta-getpar"><i class="fa fa-angle-left"></i><span>Prepared #'+i+' Subcategories</span></button></div></div>');
	i++;
}

$('#yta-menu a').addClass('btn btn-lg btn-blank');
$('#yta-menu a + ul').after('<button class="btn btn-lg btn-blank yta-getsub"><i class="fa fa-angle-right"><i class="sr-only">Office Subcategories</i></i></button>')
$(document).on( "click", '.yta-toggle', function() {
	$('html').toggleClass('yta-open');
	$('a,button,.form-control,input').each(function() {
		if (!$(this).parents('#yta-menu').length) {
			//console.log('adjust an anchor v4')
			if ($('html').hasClass('yta-open')) {
			    if ($(this).attr('tabindex')) {
			        $(this).attr('data-tabindexold',$(this).attr('tabindex'));
			    }
				$(this).attr('tabindex','-1');
			} else {
			    if ($(this).attr('data-tabindexold')) {
			        $(this).attr('tabindex',$(this).attr('data-tabindexold'));
			    } else {
				    $(this).removeAttr('tabindex');
			    }
			}
		}
	});
});

$(document).on( "click", '.yta-getsub', function() {
	var depth = $(this).parents('.yta-body').data('depth') + 1;
	var ytaret = $(this).siblings('a');
	var name = $(this).siblings('a').text();
	//console.log('name is '+name)
	$('.yta-body').each(function() {
		if ($(this).data('depth') >= depth) {
			$(this).find('ul:first').remove();
		}
	});
	$(this).siblings('ul').clone().appendTo('.yta-body[data-depth='+depth+']');
	$('.yta-body[data-depth='+depth+'] .yta-getpar span').text(name);
	$(this).parent().addClass('ytapar');
	$(this).parents('.yta-body').addClass('burr');
	$('.yta-body[data-depth='+depth+']').removeClass('deep');
	setTimeout(function() { $('.yta-body[data-depth='+depth+']').find('li').first().find('a').first().focus(); }, 100);
});
$(document).on( "click", '.yta-getpar', function() {
	var depth = $(this).parents('.yta-body').data('depth') - 1;
	$(this).parents('.yta-body').addClass('deep');
	$('.yta-body.burr[data-depth='+depth+']').removeClass('burr');
	setTimeout(function() { $('.yta-body[data-depth='+depth+'] .ytapar').find('a').first().focus(); $('.yta-body[data-depth='+depth+'] .ytapar').removeClass('ytapar'); }, 100);
});