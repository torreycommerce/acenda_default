function validateEmailAddress(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
$('.js-signup').each(function(i) {
	$(this).prepend('<div class="input-group d-none"><label for="Nolook'+i+'">Nolook Optional</label><input id="Nolook'+i+'" type="email" class="form-control form-control-nolook" name="Nolook'+i+'"></div>');
});
$('body').on('keydown','.js-signup-email',function(e){
	$(this).removeClass('is-invalid');
});
$('body').on('submit','.js-signup',function(e){
	event.preventDefault();
	var btn = $(this).find('.js-signup-btn');
	if ( $(this).find('.form-control-nolook').val() == "" ) {
		btn.prop('disabled', true).addClass('wait');
		var email = $(this).find('.js-signup-email').val();
		if (!email || !validateEmailAddress(email)) {
			$(this).find('.js-signup-email').addClass('is-invalid');
			$(this).find('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_fail1', function() {
				//console.log('got fail1');
			});
			return false;
		}
		$.post(acendaBaseUrl + '/api/email', {
			email: $(this).find('.js-signup-email').val()
		}).done(function(response) {
			$(this).find('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_success', function() {
				//console.log('got success a');
			});
			//console.log(response);
		}).fail(function(response) {
			var error = 'undefined error';
			
			//console.log(response.responseJSON.error.email[0]);
			var errortype = response.responseJSON.error.errortype;
			
			if (typeof response.responseJSON.error.email[0] != 'undefined') {
				error = response.responseJSON.error.email[0];
			}
			
			$(this).find('.js-signup-email').addClass('is-invalid');
			
			if (typeof errortype === 'string' ) {
				$(this).find('.newsletter-response').load(acendaBaseUrl+'/account/alerts #sub_fail_' + errortype, function() {
					if ($(this).find('.newsletter-response').is(':empty')) {
						$('body').append('<div class="flash-note alert alert-danger"><div class="modal-header"><div class="h3 modal-title">Subscription Error</div><a href="#" class="close" data-dismiss="alert" aria-label="close suscription error alert"><span aria-hidden="true">&times;</span></a></div><div class="modal-body">'+ error +'</div></div>');
					}
				});
			}
			else
			{
				$('body').append('<div class="flash-note alert alert-danger"><div class="modal-header"><div class="h3 modal-title">Subscription Error</div><a href="#" class="close" data-dismiss="alert" aria-label="close suscription error alert"><span aria-hidden="true">&times;</span></a></div><div class="modal-body">'+ error +'</div></div>');
			}
		}).always(function(response) {
			btn.prop('disabled', false).removeClass('wait');
		});
	}
});