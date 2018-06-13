var limit_feed = ["text", "tel", "email", "password", "url", "datetime", "time", "number"];

$('form').each(function() {
	$(this).parsley({
		successClass: 'is-valid',
		errorClass: 'is-invalid',
		errors: {
			classHandler: function(el) {
				return el;
			},
			errorsWrapper: '',
			errorElem: ''
		},
		listeners: {
			onFieldError: function ( elem, constraints, ParsleyField ) {
				if (!elem.parents('form').hasClass('was-validated'))
					elem.parents('form').addClass('was-validated');

				elem.attr("data-original-title", elem[0].validationMessage);
				elem.tooltip("show");
			},
			onFieldSuccess: function ( elem, constraints, ParsleyField ) {
				if (!elem.parents('form').hasClass('was-validated'))
					elem.parents('form').addClass('was-validated');
				elem.tooltip("dispose");
			}
		}
	});
});