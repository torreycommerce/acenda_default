
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



$('#InStockAlertEmail').keyup(function() {
	$('#InStockAlertEmail').removeClass('has_error');
	//$('.newsletter-response').html('');
});
$('#InStockAlertEmailButton').click(function() {
	var email = $('#InStockAlertEmail').val();
	if (!email || !validateEmailAddress(email)) {
		$('#InStockAlertEmail').addClass('has_error');
		$('html').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Please enter a valid email address.</div>');
		return false;
	}
	$(this).prop('disabled', true).addClass('wait');
	
	var variant_name = $('select.vopt').val();
	//var variant_name = $('#selection').val();
	var product_id = $('div.variations').data('id');
	
	$.get({
		url:acendaBaseUrl + '/api/variant',
		data:{query:{
			name:variant_name,
			product_id:product_id
		},attributes:'id' },
		success:function (response) {
			var variant_id = response.result[0].id;
			var email = $('#InStockAlertEmail').val();
			submitInStockEmail(email, variant_id);
		}
	});
});


function submitInStockEmail(email, variant_id)
{
	$.post(acendaBaseUrl + '/api/instockemail', {
		email: email,
		variant_id: variant_id
	}).done(function(response) {
		$('#InStockAlertEmailButton').prop('disabled', false).removeClass('wait');
		$('html').append('<div class="flash-note affix alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Thank you for submitting your email. You will be notified when the product variant is in stock.</div>');
		console.log(response);
	}).fail(function(response) {
		var error = 'undefined error';
		$('#InStockAlertEmailButton').prop('disabled', false).removeClass('wait');
		console.log(response.responseJSON.error.email[0]);
		if (typeof response.responseJSON.error.email[0] != 'undefined') {
			error = response.responseJSON.error.email[0];
		}
		$('#InStockAlertEmail').addClass('has_error');
		$('html').append('<div class="flash-note affix alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + error + '</div>');
	});
}


