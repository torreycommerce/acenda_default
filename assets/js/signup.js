function validateEmailAddress(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
$('#SignupInput').keyup(function() {
	$('#SignupInput').removeClass('has_error');
	//$('.newsletter-response').html('');
});
$('#SignupButton').click(function() {
	var email = $('#SignupInput').val();
	if (!email || !validateEmailAddress(email)) {
		$('#SignupInput').addClass('has_error');
		$('html').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Please enter a valid email address.</div>');
		return false;
	}
	$(this).prop('disabled', true).addClass('wait');
	$.post(acendaBaseUrl + '/api/email', {
		email: $('#SignupInput').val(),
		//verify:true
	}).done(function(response) {
		$('#SignupButton').prop('disabled', false).removeClass('wait');
		$('html').append('<div class="flash-note affix alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Thank you for signing up.</div>');
		console.log(response);
	}).fail(function(response) {
		var error = 'undefined error';
		$('#SignupButton').prop('disabled', false).removeClass('wait');
		console.log(response.responseJSON.error.email[0]);
		if (typeof response.responseJSON.error.email[0] != 'undefined') {
			error = response.responseJSON.error.email[0];
			var errortype = response.responseJSON.error.errortype;
			if (typeof  errortype != 'undefined' &&  errortype === 'briteverify' ) {
				error = typeof email_verify_message !== 'undefined' ? email_verify_message : error;
			}
		}
		$('#SignupInput').addClass('has_error');
		
		$('html').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ error +'</div>');
	});
});