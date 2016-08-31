function initCountryOpts() {
	//
	console.log('sCO()')
	var saveValue = $('#country').val()
	console.log('Is set to: '+saveValue)
	if (firstRun) {
		$("#country").html($("#country option").sort(function (a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
		}))
	}
	$('#country').val(saveValue)
	//
	if (newCountry) {
		$('#country').prepend('<option disabled selected value>Select a Country</option>')
	}
	if (newState) {
		$('#state_select').prepend('<option disabled selected value>Select a State</option>')
	}
	//
	firstRun = 0;
	newCountry = 0;
	newState = 0;
}
var firstRun = 1;
var newCountry = 0;
var newState = 0;

// ---- //

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
							if (typeof data.result !== 'undefined' && data.result.length > 0) {
								$.each(data.result, function( index, method ) {
									var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
									dropdown.append(option);
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
							sessionStorage.setItem('selected_shipping_method_checkout', null);
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
				$("#state_input").removeClass('hidden').prop( "disabled", false ).addClass('form-control')
				$('#state-label').prop('for','state_input');
				$("#state_select").addClass('hidden').prop( "disabled", true )

				$.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
					var country = $('[name$=\\[country_select\\]]').val();
					if ((country == undefined || country == '') && data.result.length > 0) {
						data.result.sort(function(a, b) { return a.value > b.value});
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
					//
					console.log('call sCO() from form-region')
					initCountryOpts()
					//
				});
			}
		},
		{
			selector: 'select[id$=state_select]',
			requires: ['select[id$=country]'],
			onChange: function(event, allValues) {
				//console.log('2')
				var state = $('[id$=\\[state_select\\]]').val();
				if (state == undefined || state == '') {
					state = 'CA';
				}
				var search_string = "country="+$('select[id$=country]').val();
					search_string = search_string + '&state=' + state;
				$(".shipping-continue").prop("disabled",true);
				if(telReady)
					$("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());
				$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
					var dropdown = $( ".shipping-method-dropdown" );
					dropdown.empty();
					if (typeof data.result !== 'undefined' && data.result.length > 0) {
						$.each(data.result, function( index, method ) {
							var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
							dropdown.append(option);
						});
						$(".shipping-continue").prop("disabled",false);
					} else {
						$(".shipping-continue").prop("disabled",true);
					}
				});
			},
			source: function(request, response) {
				if (($('#checkout_shipping_address_id').val() != '' &&
			        $('#checkout_shipping_address_id').val() != undefined) ||
			        ($('#checkout_billing_address_id').val() != '' &&
			        $('#checkout_billing_address_id').val() != undefined) ||
			        ($('#express_shipping_address_id').val() != '' &&
			        $('#express_shipping_address_id').val() != undefined)) {
						return;
					}
				//console.log('3')
				if(telReady)
					$("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());
				$.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {

					var state = $('[id$=\\[state_select\\]]').val();
					if ((state == undefined || state == '') && data.result.length > 0) {
						console.log('no default State')
						newState = 1;
						//state = data.result[0].value;
					}
					if ($('select[id$=country]').val() == "US") {
						$(".postziplang").html("Zip Code");
						$('input[placeholder="Postal Code"]').attr('placeholder','Zip');
					} else {
						$(".postziplang").html("Postal Code");
						$('input[placeholder="Zip"]').attr('placeholder','Postal Code');
					}

					if (typeof data.result !== 'undefined') {

						//If State array is empty, then show state as a text input.
						if (!$.isArray(data.result) || ($.isArray(data.result) && data.result.length == 0)) {
							$("#state_input").removeClass('hidden').prop( "disabled", false ).addClass('form-control')
							$('#state-label').prop('for','state_input');
							$("#state_select").addClass('hidden').prop( "disabled", true )
						} else {
							$("#state_input").addClass('hidden').prop( "disabled", true );
							$('#state-label').prop('for','state_select');
							$("#state_select").removeClass('hidden').prop( "disabled", false ).addClass('form-control')
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
						var dropdown = $( "#shipping_method" );
						dropdown.empty();
						if (typeof data.result !== 'undefined' && data.result.length > 0) {
							$.each(data.result, function( index, method ) {
								var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
								dropdown.append(option);
							});
							$(".shipping-continue").prop("disabled",false);
						} else {
							$(".shipping-continue").prop("disabled",true);
						}
						//
						console.log('call sCO() from form-region STATE')
						initCountryOpts()
						//
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
						//country = data.result[0].code;
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
					//
					console.log('call sCO() from form-billing-region')
					initCountryOpts()
					//
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
					var state = $('[id$=\\[state_select\\]]').val();
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
							$("#state_input").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
							$('#state-label').prop('for','state_input');
							$("#state_select").addClass('hidden').prop( "disabled", true )
						} else {
							$("#state_input").addClass('hidden').prop( "disabled", true );
							$('#state-label').prop('for','state_select');
							$("#state_select").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
						}

						response($.map(data.result, function(item, index) {
							return {
								label: item.label,
								value: item.value,
								selected: item.value.indexOf(state) != -1
							};
						}));
					}
					//
					console.log('call sCO() from form-billing-region STATE')
					initCountryOpts()
					//
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
						//
						console.log('call sCO() from form-region-customer')
						initCountryOpts();
						//
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
					//
					console.log('call sCO() from form-region-customer STATE')
					initCountryOpts();
					//
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
						data.result.sort(function(a, b) { return a.value > b.value});
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
					//
					console.log('call sCO() from form-estimate')
					initCountryOpts()
					//
				});
			}
		},
		{
			selector: 'select[id$=state_select]',
			requires: ['select[id$=country]'],
			source: function(request, response) {
				$.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {

					if (data.result.length > 0){

						$("select[id$=state_select]").removeClass('hidden')

						console.log('no default State')
						newState = 1;
						state = data.result[0].value;
						response($.map(data.result, function(item, index) {
							return {
								label: item.label,
								value: item.value,
								selected: item.value.indexOf(state) != -1
							};
						}));
					}else{
						$("select[id$=state_select]").addClass('hidden')

						$("select[id$=state_select]").val("");

						var search_string = "country="+$('select[id$=country]').val();
						$.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
							var dropdown = $( "#cart_shipping_method" );
							dropdown.empty();
							if (typeof data.result !== 'undefined' && data.result.length > 0) {
								$.each(data.result, function( index, method ) {
									var option = $('<option></option>').attr("value", method.id).text(method.name);
									dropdown.append(option);
								});
								dropdown.prop("disabled",false);
							}
						});
					}
					//
					console.log('call sCO() from form-estimate STATE')
					initCountryOpts()
					//
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
						return {
							label: item.name,
							value: item.id
						};
					}));
					$('#cart_shipping_method').change();
					//
					console.log('call sCO() from form-estimate METHOD')
					initCountryOpts()
					//
				});
			}
		}
		]
	});
}
