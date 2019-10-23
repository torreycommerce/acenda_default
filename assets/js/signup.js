function validateEmailAddress(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
$('#SignupInput').parents('form').prepend('<div class="input-group d-none"><label for="Nolook">Nolook Optional</label><input id="Nolook" type="email" class="form-control" name="Nolook"></div>');
$('#SignupInput').keyup(function() {
	$('#SignupInput').removeClass('is-invalid');
});
$('#SignupButton').click(function() {
if ( $('#Nolook').val() == "" ) {
	var email = $('#SignupInput').val();
	if (!email || !validateEmailAddress(email)) {
		$('#SignupInput').addClass('is-invalid');
		$('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_fail1', function() {
			console.log('got fail1');
		});
		return false;
	}
	$(this).prop('disabled', true).addClass('wait');
	$.post(acendaBaseUrl + '/api/email', {
		email: $('#SignupInput').val(),
		//verify:true
	}).done(function(response) {
		$('#SignupButton').prop('disabled', false).removeClass('wait');
		$('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_success', function() {
			console.log('got success');
		});
		console.log(response);
	}).fail(function(response) {
		var error = 'undefined error';
		$('#SignupButton').prop('disabled', false).removeClass('wait');
		
		console.log(response.responseJSON.error.email[0]);
		var errortype = response.responseJSON.error.errortype;
		
		if (typeof response.responseJSON.error.email[0] != 'undefined') {
			error = response.responseJSON.error.email[0];
		}
		
		$('#SignupInput').addClass('is-invalid');
		
		if (typeof errortype === 'string' ) {
			$('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_fail_' + errortype, function() {
				if ($('.newsletter-response').is(':empty')) {
					$('html').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ error +'</div>');
				}
			});
		}
		else
		{
			$('html').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ error +'</div>');
		}
	});
}
});