IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/jquery.mmenu.min.js",function(){
	$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/css/theme/jquery.mmenu.all.css">');
	
	$("#nav-mobile-main").mmenu({
		extensions: [
			'effect-slide-menu',
			'shadow-page',
			'shadow-panels'
		],
		keyboardNavigation	: true,
		screenReader		: true,
		counters: true,
		navbar	: {
			title: acendaBaseName
		},
		navbars	: [
		{
			position	: 'top',
			content	: [
				'prev',
				'title',
				'close'
			]
		}]
    });
	//
	$(document).on( "click", $('a[href$="#nav-mobile-main"]'), function() {
		$('#nav-mobile-main').removeClass('hidden');
	});
});