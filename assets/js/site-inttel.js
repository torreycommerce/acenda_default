var useIntTel = 0; // use InternationlTel flag art?
var telReady = 0;
//
//

function numbersonly(myfield, e, dec) {
	var key;
	var keychar;
	if (window.event)
		key = window.event.keyCode;
	else if (e)
		key = e.which;
	else return true;
		keychar = String.fromCharCode(key);
	// control keys
	if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
		return true;
	// numbers
	else if ((("0123456789").indexOf(keychar) > -1)) return true;
	// decimal point jump
	else if (dec && (keychar == ".")) {
		myfield.form.elements[dec].focus(); return false;
	}
	else
		return false;
}

IncludeJavaScript(acendaBaseThemeUrl+"/assets/intl-tel-input/build/js/intlTelInput.js",function(){
	telReady = 1;
	$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/intl-tel-input/build/css/intlTelInput.css">');
	var input = $("#phone");
	input.intlTelInput({
		utilsScript: acendaBaseThemeUrl+"/assets/intl-tel-input/build/js/utils.js",
		nationalMode: true
	});
	input.on("keyup change", function() {
		$("#intlPhone").val(input.intlTelInput("getNumber"));
	});
});