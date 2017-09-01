var useDatePicker = 0; // use date input calendar art?
//
var useGMapNorm = 0; // use google map normalizer?
//


if (useDatePicker) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/bootstrap-datepicker.js",function(){
		$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/css/theme/datepicker.css">');
		$('input[datepicker=1]').datepicker({
			format: 'yyyy-mm-dd'
		});
	});
}
//
if (useGMapNorm) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/google_map_normalizer.js",function(){
	});
}