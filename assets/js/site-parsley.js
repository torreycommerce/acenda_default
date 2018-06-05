var limit_feed = ["text", "tel", "email", "password", "url", "datetime", "time", "number"];

	$('form').each(function() {
		$(this).parsley({
			successClass: 'has-success',
			errorClass: 'has-error',
			errors: {
				classHandler: function(el) {
					return el.parent();
				},
				errorsWrapper: '',
				errorElem: ''
			},
			listeners: {
				onFieldError: function ( elem, constraints, ParsleyField ) {
					if (!elem.parents('.form-group').hasClass('has-feedback'))
						elem.parents('.form-group').addClass('has-feedback');

					if ($.inArray(elem[0].type, limit_feed) >= 0){
					  if (elem.parent().find(".fa"))
						  elem.parent().find(".fa").remove();
					  elem.after('<span class="fa fa-exclamation-triangle form-control-feedback"></span>');
					}

					elem.attr("data-original-title", elem[0].validationMessage);
					elem.tooltip("show");
				},
				onFieldSuccess: function ( elem, constraints, ParsleyField ) {					
					if (!elem.parents('.form-group').hasClass('has-feedback'))
						elem.parents('.form-group').addClass('has-feedback');
					if ($.inArray(elem[0].type, limit_feed) >= 0){
					  if (elem.parent().find(".fa"))
						  elem.parent().find(".fa").remove();
					  elem.after('<span class="fa fa-ok form-control-feedback"></span>');
					}

					elem.tooltip("dispose");
				}
			}
		});
	});