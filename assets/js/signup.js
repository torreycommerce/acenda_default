function validateEmailAddress(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
$('.js-signup').each(function(i) {
	$(this).prepend('<div class="input-group d-none"><label for="notSee'+i+'">notSee Optional</label><input id="notSee'+i+'" type="email" class="form-control form-control-notSee" name="notSee'+i+'"></div>');
});
$('body').on('keydown','.js-signup-email',function(){
	$(this).removeClass('is-invalid');
});

function signupEmptyFail(error) {
	$('body').append('<div class="flash-note alert alert-danger"><div class="modal-header"><div class="h3 modal-title">Subscription Error</div><a href="#" class="close" data-dismiss="alert" aria-label="close suscription error alert"><span aria-hidden="true">&times;</span></a></div><div class="modal-body">'+ error +'</div></div>');
}

$('body').on('submit','.js-signup',function(){
	event.preventDefault();
	var thisSub = $(this);
	var btn = thisSub.find('.js-signup-btn');
	if ( thisSub.find('.form-control-notSee').val() == "" ) {
		btn.prop('disabled', true).addClass('wait');
		var email = thisSub.find('.js-signup-email').val();
		if (!email || !validateEmailAddress(email)) {
			thisSub.find('.js-signup-email').addClass('is-invalid');
			return false;
		}
		$.post(acendaBaseUrl + '/api/email', {
			email: thisSub.find('.js-signup-email').val()
		})
		.done(function(response) {
			thisSub.find('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_success', function() {
			});
		})
		.fail(function(response) {
			var error = 'undefined error';
			
			//console.log(response.responseJSON.error.email[0]);
			var errortype = response.responseJSON.error.errortype;
			
			if (typeof response.responseJSON.error.email[0] != 'undefined') {
				error = response.responseJSON.error.email[0];
			}
			
			thisSub.find('.js-signup-email').addClass('is-invalid');
			
			if (typeof errortype === 'string' ) {
				thisSub.find('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_fail_' + errortype, function() {
					if (thisSub.find('.newsletter-response').is(':empty')) {
						signupEmptyFail(error)
					}
				});
			}
			else
			{
				signupEmptyFail(error)
			}
		})
		.always(function() {
			btn.prop('disabled', false).removeClass('wait');
		});
	}
});