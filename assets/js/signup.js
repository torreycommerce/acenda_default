
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
		$('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_fail1', function() {
			console.log('got fail1');
		});
		//$('html').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Please enter a valid email address.</div>');
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
		//$('html').append('<div class="flash-note affix alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Thank you for signing up.</div>');
		console.log(response);
	}).fail(function(response) {
		var error = 'undefined error';
		$('#SignupButton').prop('disabled', false).removeClass('wait');
		
		console.log(response.responseJSON.error.email[0]);
		var errortype = response.responseJSON.error.errortype;
		
		if (typeof response.responseJSON.error.email[0] != 'undefined') {
			error = response.responseJSON.error.email[0];
		}
		
		$('#SignupInput').addClass('has_error');
		
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
});


