function initCountryOpts() {
	var saveValue = $('#country').attr('data-value');

	if (newCountry) {
		$('#country').prepend('<option disabled selected value>Select a Country</option>')
	}
	if (newState) {
		$('#state_select').prepend('<option disabled selected value>Select a State</option>')
		if(!$('#country').val()){
			$('#state_select').prop("disabled", true)
		}
	}

	firstRun = 0;
	newCountry = 0;
	newState = 0;

	updateEstimates();
}
var firstRun = 1;
var newCountry = 0;
var newState = 0;

// ---- //


function updateEstimates() {
	$('[name="cart[zip_code]"]').val( $('[name="shipping[shipping_zip]"]').val() );
	$('[name="cart[country]"]').val( $('[name="shipping[shipping_country]"]').val() );
	$('[name="cart[state]"]').val( $('[name="shipping[shipping_state]"]').val() );
	$('[name="cart[method]"]').val( $('[name="shipping[shipping_method]"]').val() );										
	if(typeof estimator !== 'undefined') estimator('');	

    if(!$('[name="shipping[shipping_country]"]').val() && !$('select#checkout_shipping_address_id').val()) {
        $('select#shipping_method').prop("disabled",true);
		$('select#shipping_method').children().remove().end()        

    } else {
        $('select#shipping_method').prop("disabled",false);    
    }
}

$('[name="shipping[shipping_zip]"]').change(function() {
	updateEstimates();
});
$('select#shipping_method').change(function() {
	updateEstimates();
});


if ($('.form-region').length) {
	$('.form-region').cascadingDropdown({
		selectBoxes: [
		{
			selector: 'select[id$=checkout_shipping_address_id]',
			onChange: function(event, id) {
				if (id !== undefined && id !== ""){
					$.getJSON(acendaBaseUrl + '/api/customeraddress/'+id, function(data) {
						var search_string = "country="+data.result.country;
							search_string = search_string + '&state=' + data.result.state;
						if(telReady)
							$("#phone").intlTelInput("setCountry", data.result.country.toLowerCase());
						$(".shipping-continue").prop("disabled",true);
						$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
							var dropdown = $( "#shipping_method" );
							dropdown.empty();
							var shippingMethod = sessionStorage.getItem('selected_shipping_method_checkout');
							if (typeof data.result !== 'undefined' && data.result.length > 0) {
								$.each(data.result, function( index, method ) {
									var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
									dropdown.append(option);
									if(shippingMethod && method.id == shippingMethod){
										dropdown.val(shippingMethod);
									};
								});
								$("select[id$=checkout_shipping_address_id]").prop("disabled",false);
							} else {
								$("select[id$=checkout_shipping_address_id]").prop("disabled",true);
							}
						});
					});
				}
			},
			source: function(request, response) {
				var id = $('select[id$=checkout_shipping_address_id]').val();
				if (id !== "" && id !== undefined){
					$.getJSON(acendaBaseUrl + '/api/customeraddress/'+id, function(data) {
						var search_string = "country="+data.result.country;
							search_string = search_string + '&state=' + data.result.state;
						if(telReady)
							$("#phone").intlTelInput("setCountry", data.result.country.toLowerCase());
						$(".shipping-continue").prop("disabled",true);
						$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
							var dropdown = $( "#shipping_method" );
							dropdown.empty();
							var shippingMethod = sessionStorage.getItem('selected_shipping_method_checkout');
							if (typeof data.result !== 'undefined' && data.result.length > 0) {
								$.each(data.result, function( index, method ) {
									var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
									dropdown.append(option);
									if(shippingMethod && method.id == shippingMethod){
										dropdown.val(shippingMethod);
									};

								});
								$("select[id$=checkout_shipping_address_id]").prop("disabled",false);
							} else {
								$("select[id$=checkout_shipping_address_id]").prop("disabled",true);
							}
						});
					});
				}else{
					$("select[id$=checkout_shipping_address_id]").prop("disabled",false);
				}
			}
		},
		{
			selector: 'select[id$=country]',
			source: function(request, response) {

				$("#state_input").removeClass('hidden-x').prop( "disabled", false ).addClass('form-control')
				$('#state-label').prop('for','state_input');
				$("#state_select").addClass('hidden-x').prop( "disabled", true )
                $('select#state_select').parent().removeClass('has-error');
				$.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
					var country = (typeof countrySelect !== 'undefined')?countrySelect:$('[name$=\\[country_select\\]]').val();
					if ((country == undefined || country == '') && data.result.length > 0) {
						//data.result.sort(function(a, b) { return a.value > b.value});
						console.log('no default Country')
						newCountry = 1;
						//country = data.result[0].value;
					}

					if (telReady && country) {
						$("#phone").intlTelInput("setCountry", country.toLowerCase());
					}

					response($.map(data.result, function(item, index) {
						return {
							label: item.label,
							value: item.value,
							selected: item.value.indexOf(country) != -1
						};
					}));
					initCountryOpts()
				});
			}
		},
		{
			selector: 'select[id$=state_select]',
			requires: ['select[id$=country]'],
			onChange: function(event, allValues) {

				//console.log('2')
				//var state = $('[id$=\\[state_select\\]]').val();
				var state = $('[id$=state_select]').val();
				if (state == undefined || state == '') {
					state = 'CA';
					newState = 1;
				}
				var search_string = "country="+$('select[id$=country]').val();
					search_string = search_string + '&state=' + state;
				$(".shipping-continue").prop("disabled",true);
				if(telReady && $('select[id$=country]').val())
					$("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());
				$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
					//var dropdown = $( ".shipping-method-dropdown" );
					var dropdown = $( "#shipping_method" );
					dropdown.empty();
					var shippingMethod = sessionStorage.getItem('selected_shipping_method_checkout');
					if (typeof data.result !== 'undefined' && data.result.length > 0) {
						$.each(data.result, function( index, method ) {
							if (method.status == "active"){
								var option = $('<option class="ver4"></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
								dropdown.append(option);
								console.log('adding '+ method.name);
								if(shippingMethod && method.id == shippingMethod){
									dropdown.val(shippingMethod);
								};
							}
						});
						$(".shipping-continue").prop("disabled",false);
					} else {
						$(".shipping-continue").prop("disabled",true);
					}
				});
			},
			source: function(request, response) {
				//console.log('3')
				if(telReady)
					$("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());
				$.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {

					var state = $('[name$=\\[state_select\\]]').val();
					if ((state == undefined || state == '') && data.result.length > 0) {
						console.log('no default State')
						newState = 1;
						//state = data.result[0].value;
					}
					if ($('select[id$=country]').val() == "US") {
						$(".postziplang").html("Zip Code");
						$('input[placeholder="Postal Code"]').attr('placeholder','Zip Code');
					} else {
						$(".postziplang").html("Postal Code");
						$('input[placeholder="Zip"]').attr('placeholder','Postal Code');
					}
					if (typeof data.result !== 'undefined') {
						//review/id
						//If State array is empty, then show state as a text input.
						if (!$.isArray(data.result) || ($.isArray(data.result) && data.result.length == 0)) {
							$("#state_input").removeClass('hidden').prop( "disabled", false ).addClass('form-control')
							$('#state-label').prop('for','state_input');
							$("#state_select").addClass('hidden').prop( "disabled", true )
                            $('select#state_select').parent().removeClass('has-error');							
						} else {
							$("#state_input").addClass('hidden').prop( "disabled", true );
							$('#state-label').prop('for','state_select');
							$("#state_select").removeClass('hidden').prop( "disabled", false ).addClass('form-control')
                            $('select#state_select').parent().removeClass('has-error');
						}

						response($.map(data.result, function(item, index) {
							return {
								label: item.label,
								value: item.value,
								selected: item.value.indexOf(state) != -1
							};
						}));
					}

					var search_string = "country="+$('select[id$=country]').val();
					if ($('#state').val()) {
						search_string = search_string + '&state=' + $('#state').val();
					}
					$(".shipping-continue").prop("disabled",true);

					$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
						if ($('#checkout_shipping_address_id').val() == '' ||
					        $('#checkout_shipping_address_id').val() == undefined) {

							var dropdown = $( "#shipping_method" );
							dropdown.empty();
							var shippingMethod = sessionStorage.getItem('selected_shipping_method_checkout');
							if (typeof data.result !== 'undefined' && data.result.length > 0) {
								$.each(data.result, function( index, method ) {
									if (method.status == "active"){
										var option = $('<option class="ver5"></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
										dropdown.append(option);
										if(shippingMethod && method.id == shippingMethod){
											dropdown.val(shippingMethod);
										};
									}
								});
								$(".shipping-continue").prop("disabled",false);
							} else {
								$(".shipping-continue").prop("disabled",true);
							}
						}
						initCountryOpts()
					});
				});
			},
		}
		]
	});
}


// Billing address form
if ($('.form-billing-region').length) {
	$('.form-billing-region').cascadingDropdown({
		selectBoxes: [
		{
			selector: 'select[id$=country]',
			source: function(request, response) {
				$.getJSON(acendaBaseUrl + '/api/payment/country', request, function(data) {
					var country = $('[name$=\\[country_select\\]]').val();
					if (data.result !== undefined && data.result.length > 0){
						console.log('no default Country')
						newCountry = 1;
						if(data.result.length < 2) {
                            country = data.result[0].code;
                        }
					}
					if (telReady && country) {
						$("#phone").intlTelInput("setCountry", country.toLowerCase());
					}

					response($.map(data.result, function(item, index) {
						return {
							label: item.name,
							value: item.code,
							selected: item.code.indexOf(country) != -1
						};
					}));
					initCountryOpts()
				});
			}
		},
		{
			selector: 'select[id$=state_select]',
			requires: ['select[id$=country]'],
			source: function(request, response) {
				//console.log($('select[id$=country]').val());
				if(telReady)
					$("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());

				$.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
					var state = $('[name$=\\[state_select\\]]').val();
					if ((state == undefined || state == '') && data.result.length > 0) {
						console.log('no default State')
						newState = 1;
						//state = data.result[0].value;
					}
					if ($('select[id$=country]').val() == "US") {
						$(".postziplang").html("Zip Code");
					   $('input[placeholder="Postal Code"]').attr('placeholder','Zip Code');
					} else {
						$(".postziplang").html("Postal Code");
						$('input[placeholder="Zip Code"]').attr('placeholder','Postal Code');
					}

					if (typeof data.result !== 'undefined') {

						//If State array is empty, then show state as a text input.
						if (!$.isArray(data.result) || ($.isArray(data.result) && data.result.length == 0)) {
							$("#state_input").removeClass('hidden-x').prop( "disabled", false ).addClass('form-control').show();
							$('#state-label').prop('for','state_input');
							$("#state_select").addClass('hidden-x').prop( "disabled", true );
                            $('select#state_select').parent().removeClass('has-error');							
						} else {
							$("#state_input").addClass('hidden-x').prop( "disabled", true );
							$('#state-label').prop('for','state_select');
							$("#state_select").removeClass('hidden-x').prop( "disabled", false ).addClass('form-control').show();
						}

						response($.map(data.result, function(item, index) {
							return {
								label: item.label,
								value: item.value,
								selected: item.value.indexOf(state) != -1
							};
						}));
					}
					initCountryOpts()
				});
			},
		}
		]
	});
}


// Customer address
if ($('.form-region-customer').length) {
	$('.form-region-customer').cascadingDropdown({
		selectBoxes: [
		{
			selector: 'select[id$=country]',
			source: function(request, response) {
				$.getJSON(acendaBaseUrl + '/api/payment/country', request, function(data) {
					var billing_countries = $.map(data.result, function(item, index) {
						return {
							label: item.name,
							value: item.code,
						};
					});
					$.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
						var countries = data.result.concat(billing_countries);
						for(var i=0; i<countries.length; ++i) {
							for(var j=i+1; j<countries.length; ++j) {
								if(countries[i].value === countries[j].value)
									countries.splice(j--, 1);
							}
						}

						var country = $('[name$=\\[country_select\\]]').val();
						if ((country == undefined || country == '') && data.result.length > 0) {
							console.log('no default Country')
							newCountry = 1;
							//country = countries[0].value;
						}
						if(telReady)
							$("#phone").intlTelInput("setCountry", country.toLowerCase());
						response($.map(countries, function(item, index) {
							return {
								label: item.label,
								value: item.value,
								selected: item.value.indexOf(country) != -1
								//selected: item.value.indexOf(country)
							};
						}));

						initCountryOpts();
					});
				});
			}
		},
		{
			selector: 'select[id$=state_select]',
			requires: ['select[id$=country]'],
			source: function(request, response) {
				console.log('now state does its thing')
				if(telReady)
					$("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());
				$.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
					var state = $('[name$=\\[state_select\\]]').val();
					if ((state == undefined || state == '') && data.result.length > 0) {
						console.log('no default State')
						newState = 1;
						//state = data.result[0].value;
					}
					if ($('select[id$=country]').val() == "US") {
						$(".postziplang").html("Zip Code");
						$('input[placeholder="Postal Code"]').attr('placeholder','Zip Code');
					} else {
						$(".postziplang").html("Postal Code");
						$('input[placeholder="Zip Code"]').attr('placeholder','Postal Code');
					}

					if (typeof data.result !== 'undefined') {
						//account/addresses
						console.log('acct')
						//If State array is empty, then show state as a text input.
						if ($.isArray(data.result) && data.result.length == 0) {
							$("#state_input").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
							$('#state-label').prop('for','state_input');
							$("#state_select").addClass('hidden').prop( "disabled", true )
						} else {
							$("#state_input").addClass('hidden').prop( "disabled", true );
							$('#state-label').prop('for','state_select');
							$("#state_select").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
						}
					}

					response($.map(data.result, function(item, index) {
						return {
							label: item.label,
							value: item.value,
							selected: item.value.indexOf(state) != -1
						};
					}));
					initCountryOpts();
				});
			},
		}
		]
	});
}


if ($('.form-estimate').length) {
	$('.form-estimate').cascadingDropdown({
		selectBoxes: [
		{
			selector: 'select[id$=country]',
			source: function(request, response) {
				$.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
					if (data.result.length > 0){
						//data.result.sort(function(a, b) { return a.value > b.value});
						console.log('no default Country')
						newCountry = 1;
						//country = data.result[0].value;
						response($.map(data.result, function(item, index) {
							return {
								label: item.label,
								value: item.value,
								selected: item.value.indexOf(country) != -1
							};
						}));
					}
					initCountryOpts();
					$('#cart_shipping_method').change();
					$('#country').change();
				});
			}
		},
		{
			selector: 'select[id$=state_select]',
			requires: ['select[id$=country]'],
			source: function(request, response) {
				$.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {

					if (data.result.length > 0){

						$("select[id$=state_select]").removeClass('hidden-x')
						
						saveValue = null;
						if(typeof($('select[id$=state_select]').attr('data-value')) != 'undefined') {
							saveValue = $('select[id$=state_select]').attr('data-value');
						}
						newState = 1;
						state = data.result[0].value;
						response($.map(data.result, function(item, index) {
							return {
								label: item.label,
								value: item.value,
								selected: item.value.indexOf(state) != -1 && saveValue == null
							};
						}));

						if(saveValue != null) {
							$('select[id$=state_select] option[value="'+saveValue+'"]').prop('selected', true);
						}
					}else{
						$("select[id$=state_select]").addClass('hidden-x')

						$("select[id$=state_select]").val("");

						var search_string = "country="+$('select[id$=country]').val();
						$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
							var dropdown = $( "#cart_shipping_method" );
							dropdown.empty();
							if (typeof data.result !== 'undefined' && data.result.length > 0) {
								$.each(data.result, function( index, method ) {
									if (method.status == "active"){
										var option = $('<option class="ver1"></option>').attr("value", method.id).text(method.name);
										dropdown.append(option);
									}
								});
								dropdown.prop("disabled",false);
							}
						});
					}
					$('#state_select').change();
					$('#cart_shipping_method').change();

					//initCountryOpts();
				});
			}
		},
		{
			selector: 'select[id$=cart_shipping_method]',
			requires: ['select[id$=state_select]'],
			source: function(request, response) {
				var search_string = "country="+$('select[id$=country]').val();
				if ($('select[id$=state_select]').val() !== undefined){
					search_string += '&state=' + $('select[id$=state_select]').val();
				}
				$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, request, function(data) {
					shipping_method = data.result[0].id;

					response($.map(data.result, function(item, index) {
						if (item.status == "active") {
							return {
								label: item.name,
								value: item.id
							};
						}
					}));

					if(typeof($('select[id$=cart_shipping_method]').attr('data-value')) != 'undefined') {
						saveValue = $('select[id$=cart_shipping_method]').attr('data-value');
						$('select[id$=cart_shipping_method] option[value="'+saveValue+'"]').prop('selected', true);					
					}
					$('#cart_shipping_method').change();
				});
			}
		}
		]
	});
}
