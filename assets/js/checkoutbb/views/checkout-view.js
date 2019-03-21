var checkout = checkout || {};

(function ($) {
	'use strict';
	checkout.CheckoutView = Backbone.View.extend({
		start_step: '',
		el: '.checkoutapp',
		summaryView: null,
		cart: new checkout.Cart(),
		checkout_state: {},
		default_address: null,
		selected_shipping_address: null,
		selected_billing_address: null,
		shipping_countries: null,
		billing_countries: null,
		shipping_states: null,
		billing_states: null,
		customer: new checkout.Customer(),
		customer_addresses: new checkout.CustomerAddresses(),
		shipping_methods: new checkout.ShippingMethods(),
		logged_in: acendaIsLoggedIn,
		api_unique_token: null,
		stripe: null,
		stripe_elements: null,
		stripe_card: null,
        stripe_payment_details: '',		
		stripe_style : {
		  base: {
		    color: '#32325d',
		    lineHeight: '18px',
		    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
		    fontSmoothing: 'antialiased',
		    fontSize: '16px',
		    '::placeholder': {
		      color: '#aab7c4'
		    }
		  },
		  invalid: {
		    color: '#fa755a',
		    iconColor: '#fa755a'
		  }
		},	
		card_type: '',
		card_last_four: '',
        bt_client_token: '',

        bt_payment_details: '',
        bt_environment: 'sandbox',        
        bt_device_data: null,
        bt_dropin_instance: null,
        waits: {
        	got_cart: false,
        	got_customer: false,
        	got_customer_addresses: false,
        	got_shipping_countries: false,
        	got_shipping_states: false,
        	got_billing_states: false,
        	got_billing_countries: false
        },
		current_step: '',
		checkout_steps: [
		    {name: 'signin', form: '#guest-form', collapse: '#collapseSignIn', edit: '#btn-edit-signin', completed: false, open: false, check: 'checkSignin'},
		    {name: 'shipping', form: '#shipping-address-form', collapse: '#collapseShipping', edit: '#btn-edit-shipping' , completed: false, open: false, check: 'checkShipping'},
		    {name: 'shipping-method', form: '#shipping-method-form', collapse: '#collapseShippingMethod', edit: '#btn-edit-shipping-method' , completed: false, open: false,check: 'checkShippingMethod'},
		    {name: 'payment', form: '#payment-form', collapse: '#collapsePayment',edit: '#btn-edit-payment', completed: false, open: false,check: 'checkPayment'},
		    {name: 'review', collapse: '#collapseReview', edit: '#btn-edit-review' , completed: false, open: false}
		],
		events: {
			'click #btn-continue-signin' : 'checkSignin',
			'click #btn-login-signin' : 'login',
			'click #btn-continue-shipping' : 'checkShipping',
			'click #btn-continue-shipping-method' : 'checkShippingMethod',
			'click #btn-continue-payment' : 'checkPayment',
			'click #btn-go-back-shipping-method' : 'goBackToShipping',
			'click #btn-place-order' : 'placeOrder',
			'click #btn-edit-billing-address' : 'editBillingAddress',
			'change #shipping-country' : 'changedShippingCountry',
			'change #billing-country' : 'changedBillingCountry',
			'change #customer-addresses select' : 'changedSavedAddress',
			'change #login-form input' : 'changedLogin'	,
			'change input[name=shipping_method]' : 'changedShippingMethod',
			'keyup #checkout_card_number' : 'keyUpCardNumber',
			'keyup .verify-change-shipping' : 'changedAddress',
            'change .verify-change-shipping' : 'changedAddress',
			'keyup .verify-change-billing' : 'changedAddress',
            'change .verify-change-billing' : 'changedAddress',
            'change input[name=copy_shipping_to_billing]' : 'changedCopyShippingToBilling',
            'change input[name=create_account]' : 'changedCreateAccount',
            'keyup input[name=new_user_password],input[name=new_user_password_verify]' : 'changedCreateAccountPassword'
		},
		initialize: function () {
			var that = this;
			if(typeof Stripe !=='undefined') {
				this.stripe = Stripe('pk_test_sfeTZWyK92ZxH5srHuIwWzXs');
				this.stripe_elements = this.stripe.elements();
			}
			if(typeof saved_checkout_step !== 'undefined' && saved_checkout_step) {
				if(saved_checkout_step == 'shippingmethod') saved_checkout_step = 'shipping-method';
				this.start_step=saved_checkout_step;
			}

			this.summaryView = new checkout.SummaryView();
			this.cart.on('change',function(e) {
				if(that.cart.ready === true ) {
				    that.render();
			    }
			});
			this.customer.on('change',function(e) {

			});
			// setup edit buttons
			_.each(this.checkout_steps,function(step,k){
				$(step.edit).click(function() {
					that.gotoStep(step.name);
				})
			});
			this.fetchCart();
			this.fetchShippingCountries();
			this.fetchBillingCountries();
            if(that.logged_in) {
            	//this.setStepCompleted('signin',true)
	            $('#'+'billing'+ '-address-form .hide-billing').hide();
	            $('#'+'shipping'+ '-address-form .hide-shipping').hide();
	        }
			this.setupBrainTree();
			this.setupStripe();
			this.waitForEverything();
		},
		findStartStep: function() {
			var that = this;
			if(that.start_step=='') that.start_step = 'signin';
			if(that.start_step=='review') that.start_step='payment';
			var stop = false;
			_.each(this.checkout_steps,function(step) {
				if(!stop) {
					if(step.name == 'shipping') {
						that.checkShipping(void 0, true);
					}

					if(step.name == that.start_step) {
						that.gotoStep(step.name);
						stop = true;
					} else {
	    				that.setStepCompleted(step.name);
	    			}
	    		}
			});

		},
		gotEverything: function() {
			var that = this;
			var shipping_address_selected = that.cart.get('shipping_address_selected');
			var billing_address_selected = that.cart.get('billing_address_selected');
			var shipping_method = that.cart.get('shipping_method');
			var copy_shipping = that.cart.get('copy_shipping');
			if(that.logged_in) {
			    if(that.default_address!==null && (typeof shipping_address_selected == undefined || shipping_address_selected == null) ) {
			    	$('#shipping-customer-addresses-select').val(that.default_address);
			    	that.changedSavedAddress({target: $('#shipping-customer-addresses-select')[0]},'shipping');
			    }
		        if(that.default_address!==null && (typeof billing_address_selected == undefined || billing_address_selected == null) ) {
			    	$('#billing-customer-addresses-select').val(that.default_address);
			    	that.changedSavedAddress({target: $('#billing-customer-addresses-select')[0]},'billing');
			    }
			    if(typeof shipping_address_selected !== 'undefined' && shipping_address_selected !==null) {
			    	$('#shipping-customer-addresses-select').val(shipping_address_selected);
			    	that.changedSavedAddress({target: $('#shipping-customer-addresses-select')[0]},'shipping');
			    }
			    if(typeof billing_address_selected !== 'undefined' && billing_address_selected !==null) {
			    	$('#billing-customer-addresses-select').val(billing_address_selected);
			    	that.changedSavedAddress({target: $('#billing-customer-addresses-select')[0]},'billing');
			    }
				if(!this.customer_addresses.length) {
			     	$('#shipping-address-form .hide-shipping').slideDown();
				}
				if(!this.customer_addresses.length) {
			     	$('#billing-address-form .hide-billing').slideDown();
				}
			}

		    if(typeof shipping_method !== 'undefined' && shipping_method !==null) {
		    	that.fetchShippingMethods();
		    }
		    if(typeof copy_shipping !== 'undefined' && copy_shipping !==null) {
		    	if(copy_shipping == '1') {
					$("input[name=copy_shipping_to_billing]").each(function()
					{
					    this.checked = true;
					});
		    	} else {
		   			$("input[name=copy_shipping_to_billing]").each(function()
					{
					    this.checked = false;
					});
		    	}
				that.changedCopyShippingToBilling();
		    }

		},
		waitForEverything: function(count) {
			var that = this;
			if(typeof count == 'undefined') var count = 0;
			var got_everything = Object.keys(that.waits).every(function(k){ return that.waits[k] === true });
			if(count > 30) {
				alert('There was a problem loading the checkout process');
			}
			if(got_everything) {
 				that.findStartStep();
 				that.render();
			    that.gotEverything();
			}else {
			     setTimeout(function() { that.waitForEverything(count++); } ,200);
			}
		},
		render: function () {
			var that = this;
			var passed_current = false;
			$('.btn-edit').css({display: 'none'});
			_.each(this.checkout_steps,function(step){
    			 if(step.name == that.current_step) {
    			 	passed_current=true;
    			 }
				 if( !(step.name=='signin' && that.logged_in) && (step.completed && !step.open) && !passed_current) {
				 	 $(step.edit).show();
				 } else {
				 	 $(step.edit).hide();
				 }
			});

		    if(this.shipping_countries !==null && $('#shipping-country').children().length<2 ) {
				this.shipping_countries.each(function (country) {
					var currentCountry = $('#shipping-country').val();
					if(!currentCountry) currentCountry='US';
					var tpl = _.template('<option <%= (country.get("value") == current)?"selected":""%> value="<%=country.get("value")%>"><%=country.get("label")%></option>');
	                $('#shipping-country').append(tpl({country:country,current: currentCountry}));
				});
			}
		    if(this.billing_countries !==null && $('#billing-country').children().length<2 ) {
				this.billing_countries.each(function (country) {
					var currentCountry = $('#billing-country').val();
					if(!currentCountry) currentCountry='US';
					var tpl = _.template('<option <%= (country.get("code") == current)?"selected":""%> value="<%=country.get("code")%>"><%=country.get("name")%></option>');
	                $('#billing-country').append(tpl({country:country,current: currentCountry}));
				});
			}
		    if(this.shipping_states !== null && $('#shipping-state-select').children().length<2 ) {
				this.shipping_states.each(function (state) {
					var tpl = _.template('<option ' + (( shipping_state_val == state.get('value'))?"selected":"") +  ' value="<%=state.get("value")%>"><%=state.get("label")%></option>');
	                $('#shipping-state-select').append(tpl({state:state}));
				});
				if(!this.shipping_states.length) {
					$('#shipping-state-select').hide();
					$('#shipping-state-text').show();
					$('#state-label').prop('for','shipping-state-text');

				} else {
					$('#shipping-state-select').show();
					$('#shipping-state-text').hide();
					$('#state-label').prop('for','shipping-state-select');
				}
			}

			var savedAddy = $('#shipping-customer-addresses-select').val();
			if( savedAddy != 0) {
				var addy=this.customer_addresses.get(savedAddy);
                if(addy) {
                	$('#shipping-state-select').val(addy.get('state'));
                }
			}
		    if(this.billing_states !== null && $('#billing-state-select').children().length<2 ) {
				this.billing_states.each(function (state) {
					var tpl = _.template('<option value="<%=state.get("value")%>"><%=state.get("label")%></option>');
	                $('#billing-state-select').append(tpl({state:state}));
				});
				if(!this.billing_states.length) {
					$('#billing-state-select').hide();
					$('#billing-state-text').show();
					$('#billing-state-label').prop('for','billing-state-text');
					if(typeof $('#billing-state-text').parsley !== 'undefined') {
						$('#billing-state-text').parsley('addConstraint', {
		                    required: true
		                });

						$('#billing-state-select').parsley('removeConstraint','required');

					}					
				} else {
					$('#billing-state-select').show();
					$('#billing-state-text').hide();
					$('#billing-state-label').prop('for','billing-state-select');
					if(typeof $('#billing-state-text').parsley !== 'undefined') {					
						$('#billing-state-text').parsley('removeConstraint', 'required');
						$('#billing-state-select').parsley('addConstraint', {
		                    required: true
		                });
					}

				}
			}

			var savedAddy = $('#billing-customer-addresses-select').val();
			if( savedAddy != 0) {
				var addy=this.customer_addresses.get(savedAddy);
                if(addy) {
                	$('#billing-state-select').val(addy.get('state'));
                }
			}
			this.renderSigninSummary();
			this.renderShippingMethodSummary();
			this.renderPaymentSummary();
			this.renderShippingAddressSummary();
			this.summaryView.render();
		},
		// Fetch current cart state
		fetchCart: function (callback) {
		    var that = this;
		    this.cart.fetch()
		    .always(function(data) {
		    	that.waits.got_cart = true;
		    	if(data.result.item_count == 'undefined' || data.result.item_count == 0) {
		    		window.location = acendaBaseUrl + '/cart';
		    	}
		    }).done(function() {
	    		if(typeof callback !=='undefined') {
	    		     callback();
	    		}
		    })
		},
		setupStripe: function() {
            if(typeof acendaPaymentPlatform !== 'undefined' && acendaPaymentPlatform.toLowerCase()!='stripe') return;
			console.log('stripe',this.stripe);
			console.log('stripe_elements',this.stripe_elements);			
			// Create an instance of the card Element.
			this.stripe_card = this.stripe_elements.create('card', {style: this.stripe_style});
			console.log('stripe_card',this.stripe_card);	
			// Add an instance of the card Element into the `card-element` <div>.
			this.stripe_card.mount('#card-element');
			this.stripe_card.addEventListener('change', function(event) {
			  var displayError = document.getElementById('card-errors');
			  if (event.error) {
			    displayError.textContent = event.error.message;
			  } else {
			    displayError.textContent = '';
			  }
			});			
		},
		setupBrainTree: function() {
  			var that = this;
            if(typeof acendaPaymentPlatform !== 'undefined' && acendaPaymentPlatform.toLowerCase()!='braintree') return;
			if(that.bt_dropin_instance !== null) that.bt_dropin_instance.teardown();
  			$.post(acendaBaseUrl+'/api/braintree/token', function(data) {
  				that.bt_client_token = data.result.client_token;
  				that.bt_environment = data.result.environment;
		        braintree.dropin.create({
		          debug: true,
		          authorization: that.bt_client_token,
		          container: '#dropin-container',
		          paypal: {
		            flow: 'vault'
		          },
				  dataCollector: {
				    kount: true,
				    paypal: true
				  }
		        }, function (createErr, instance) {
		            that.bt_dropin_instance = instance;
		            that.bt_device_data = null;
			    if(createErr) {
			  	  console.log('braintree error output',createErr);
			    }				
		        });
		    });
		},
		verifyAddress: function(stepName) {
			var that = this;
			var step = this.checkout_steps[this.findStep(stepName)];
			var formData = this.getFormData(step.form);
			var form_elem = $(step.form);

			if(step.name === 'shipping') {
				var shipping_country=$('#shipping-country').val();
				if(shipping_country!='US') return true;
				if(that.shipping_states.length) {
					formData['shipping_state'] = formData['shipping_state_select'];
				} else if(formData['shipping_state_text']) {
					formData['shipping_state'] = formData['shipping_state_text'];
				}
			}
			if(step.name === 'payment') {
			    var billing_country=$('#billing-country').val();
				if(billing_country!='US') return true;
				if(that.billing_states.length) {
					formData['billing_state'] = formData['billing_state_select'];
				} else if(formData['billing_state_text']) {
					formData['billing_state'] = formData['billing_state_text'];
				}
			}

			formData['step'] = (stepName=='payment')?'billing':'shipping';

			var addySelect = $('.checkoutapp #' + stepName + '-panel #customer-addresses select').val();

			if(that.logged_in  && addySelect!=0) return true;

			if(typeof formData['verified'] !=='undefined' && formData['verified']==1){
                form_elem.find('#address-verify').html('<input name="verified" value="1" type="hidden"/>');
				return true;
			}
			form_elem.find('#address-verify').html('<div style="margin: auto; padding: 12px 15px; color: #ddd; text-align: center;" ><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>');

			$.post(acendaBaseUrl + '/api/address/verify',formData).done(function(response) {
				var addy = response.result;
				if(formData[formData.step + '_street_line1'].toUpperCase().trim() == addy['street_line1'] &&
				    formData[formData.step + '_street_line2'].toUpperCase().trim() == addy['street_line2'] &&
				    formData[formData.step + '_city'].toUpperCase().trim() == addy['city'] &&
				    formData[formData.step + '_zip'] == addy['zip'].trim()) {
                    form_elem.find('#address-verify').html('<input name="verified" value="1" type="hidden"/>');

					switch(stepName) {
						case 'shipping':
						  that.checkShipping();
						break;
						default:
						  that.checkPayment();
						break;
					}
					return true;
				}

				form_elem.find('#address-verify').html('<input name="verified" value="1" type="hidden"/><div class="alert alert-success">Please verify your address. Select which address you would like to use:<br><br>' +
				'<input style="display:inline-block; vertical-align:middle;" type="radio" name="useaddress" id="useaddress-current"  value="current" checked> <label for="useaddress-current" style="display: inline-block; vertical-align:middle; margin-top: 7px">Current Address</label><br><div style="height: 10px"></div>' +
                '<input style="display:inline-block; vertical-align:middle;" type="radio" name="useaddress" id="useaddress-verified" value="verified"> <label for="useaddress-verified" style="display: inline-block; vertical-align:top;">' + addy['street_line1'] + ' ' +  addy['street_line2']+ '<br>' +  addy['city'] + ', ' + addy['state']	+ ' ' + addy['zip']	+ '</label>' +
				'</div>');

				form_elem.find('input[name="useaddress"]').change(function() {
			        if ($(this).is(':checked') && $(this).val() == 'verified') {
                        $(step.form + ' [name$=street_line1]').val(addy['street_line1']);
                        $(step.form + ' [name$=street_line2]').val(addy['street_line2']);
                        $(step.form + ' [name$=city]').val(addy['city']);
                        $(step.form + ' [name$=state]').val(addy['state']);
                        $(step.form + ' [name$=zip]').val(addy['zip']);
			        } else {
                        $(step.form + ' [name$=street_line1]').val(formData[formData['step']+'_street_line1']);
                        $(step.form + ' [name$=street_line2]').val(formData[formData['step']+'_street_line2']);
                        $(step.form + ' [name$=city]').val(formData[formData['step']+'_city']);
                        $(step.form + ' [name$=state]').val(formData[formData['step']+'_state']);
                        $(step.form + ' [name$=zip]').val(formData[formData['step']+'_zip']);
			        }
				});
			}).fail(function(response) {
				form_elem.find('#address-verify').html('<input name="verified" value="1" type="hidden"/><div class="alert alert-warning">We couldn\'t verify your address. Please correct your address and try again, or click the button below to continue.</div>');
			});
			return false;
		},
	    determinCardType: function(number) {
	        var re = {
	            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
	            mastercard: /^5[1-5][0-9]{14}$/,
	            amex: /^3[47][0-9]{13}$/,
	            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
	        };
	        if (re.visa.test(number)) {
	            return 'visa';
	        } else if (re.mastercard.test(number)) {
	            return 'mastercard';
	        } else if (re.amex.test(number)) {
	            return 'amex';
	        } else if (re.discover.test(number)) {
	            return 'discover';
	        } else {
	            return '';
	        }
	    },
	    keyUpCardNumber: function() {
	        var type = this.determinCardType($('#checkout_card_number').val());
	        $('.cc-visa,.cc-mastercard,.cc-amex,.cc-discover').fadeTo(0, 0.4);
	        if (type) {
	            $('.cc-' + type).fadeTo(0, 1);
	        }
	    },
		// Fetch current cart state
		fetchCustomer: function (callback) {
			var that = this;
			if(!that.logged_in) {
                that.waits.got_customer = true;
 				that.waits.got_customer_addresses = true;
 				if(typeof callback !== 'undefined') callback();
				return;
			}
		    this.customer.fetch({error: function() {  that.logged_in=false; that.waits.got_customer = true; that.waits.got_customer_addresses = true;},success: function(data) {
                that.waits.got_customer = true;
		    	that.customer_addresses.fetch({success: function() {
                    that.logged_in=true;
                    that.setStepCompleted('signin');
                    that.waits.got_customer_addresses = true;
                	var count_addy_shipping=0;
                	var count_addy_billing=0;
                    if(that.customer_addresses.length) {
                    	var tpl = _.template('<option value="<%= id %>"><%= one_line %></option> ');
                    	$('[id=customer-addresses]').show();
                    	$('#customer-addresses select').html('<option value="0">New Address</option>');
                        $('#billing-customer-addresses-select').html('<option value="0">New Address</option>');

                    	that.customer_addresses.each(function(addy){
                    		var state = addy.get('state');
                    		var country = addy.get('country');
                    		if(addy.get('default')==1) that.default_address = addy.id;

                    		if(that.shipping_countries.where({value: country}).length) {
                    			count_addy_shipping++;
                    	    	$('#shipping-customer-addresses-select').append(tpl(addy.toJSON()));
                    	    }
                    		if(that.billing_countries.where({code: country}).length) {
                 		      	count_addy_billing++;
	                    		$('#billing-customer-addresses-select').append(tpl(addy.toJSON()));
	                    	}
                    	});
                    } else {
                    	$('[id=customer-addresses]').hide();
                    }
                 	setTimeout(function() {
                    		if(!count_addy_shipping) {
                                 $('#shipping-panel [id=customer-addresses]').hide();
                    		}
                    		if(!count_addy_billing) {
                                 $('#shipping-panel [id=customer-addresses]').hide();
                    		}
 							if(typeof callback !== 'undefined') {
 								callback();
 							}
                    	},100);
		    	} ,fail: function() {
		    	    that.logged_in=true;
                    that.setStepCompleted('signin');		    	    
		    	    that.waits.got_customer_addresses = true;
                    	setTimeout(function() {
 							if(typeof callback !== 'undefined') {
 								callback();
 							}
                    	},100);
		    	}  });
		    }});
		},
		reloadToolbar: function() {
			$.get(acendaBaseUrl+'/account/tools', function(data) {
				$('#tools .tool').remove();
				$('#tools').prepend(data);
		    });
		},
		fetchShippingCountries: function() {
			var that = this;
			this.shipping_countries = new checkout.ShippingCountries();
			this.shipping_countries.fetch({success: function() {
                $('#shipping-country').html('<option disabled selected>Select a Country</option>');
				that.render();
				that.waits.got_shipping_countries = true;
				that.fetchShippingStates();
			}});
		},
		fetchBillingCountries: function() {
			var that = this;
			this.billing_countries = new checkout.BillingCountries();
			this.billing_countries.fetch({success: function() {
                $('#billing-country').html('<option disabled selected>Select a Country</option>');
				that.render();
				that.waits.got_billing_countries = true;
				that.fetchBillingStates();
			    $('input[name=create_account]').change();
			}});
		},
		fetchShippingStates: function() {
			var that = this;
			this.shipping_states = new checkout.ShippingStates();
			this.shipping_states.fetch({url: this.shipping_states.url + '?country=' + $('#shipping-country').val() ,success: function() {
				that.waits.got_shipping_states = true;
		        $('#shipping-state-select').html('<option disabled selected>Select a State</option>');
				that.render();
			}});
		},
		fetchBillingStates: function() {
			var that = this;
			this.billing_states = new checkout.BillingStates();
			this.billing_states.fetch({url: this.billing_states.url + '/' + $('#billing-country').val() ,success: function() {
				that.waits.got_billing_states = true;
		        $('#billing-state-select').html('<option disabled selected>Select a State</option>');
				that.render();
		     	that.fetchCustomer();
			}});
		},
		fetchShippingMethods: function(callback) {
			var that = this;
			var tpl = _.template($('#shipping-methods-template').html());
            $('#shipping-methods').html('<div style="margin: auto; padding: 12px 15px; color: #ddd; text-align: center;" ><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>');
			that.shipping_methods.fetch({data: {country:  $('#shipping-country').val() ,state: $('#shipping-state-select').val()} ,success: function(data) {
             	that.renderShippingMethodSummary();
		        var total = that.cart.get('item_subtotal');
						var subtotal = that.cart.get('subtotal');
		        var quantity = that.cart.get('item_count');
		        var first = true;
		        var defer_methods = [];
		        if(!that.shipping_methods.length) {
		        	 $('#btn-go-back-shipping-method').show();
		        	 $('#btn-continue-shipping-method').hide();
		        	 $('#shipping-methods').html("<span style=\"color: red\">We do not currently ship to the desired shipping address.</span>");
		        	 return;
		        } else {
		        	 $('#btn-go-back-shipping-method').hide();
		        	 $('#btn-continue-shipping-method').show();
		        }
 		        that.shipping_methods.each(function(method,k) {
		            if(first && !that.cart.get('shipping_method')) {
		            	that.cart.set('shipping_method',method.id);
		            }
		        	defer_methods[k]=$.post(acendaBaseUrl + '/api/shippingmethod/' + method.id +  '/rate',{total: subtotal,quantity: quantity}, function(response) {
		        	    that.shipping_methods.at(k).set('price',response.result.rate);
		                $('#shipping-methods').html(tpl({methods: that.shipping_methods.toJSON(), current_method: that.cart.get('shipping_method')}));
		                $('#shipping-methods label .d-none').each(function() {
		                	$(this).parents('label').find('.val').text($(this).text());
		                });
		                setTimeout(function() {
					        $('tr[method="' +  method.id + '"] #spinner').show();  
					        $.get(acendaBaseUrl + '/api/shippingtools/deliveryestimates/?carrier='+method.get('carrier_name')).done(function(data) {
					            var estimates = data.result;
					            $.each(estimates,function(ek,estimate){
					                if(typeof estimate.estimate == 'undefined') return;
					                var estimate_string = moment(estimate.estimate).calendar(null, {
					                    sameDay: 'By [Today]',
					                    nextDay: 'By [Tomorrow], MM/DD',
					                    nextWeek: 'By dddd, MM/DD',
					                    lastDay: '[Yesterday], MM/DD',
					                    lastWeek: '[Last] dddd, MM/DD',
					                    sameElse: 'By MM/DD/YYYY'
					                });
					                var elem = $('label.' +ek).html(estimate_string);
					            });
					        }).always(function(){
					            $('tr[method="' +  method.id + '"] #spinner').hide();
					        });
					    },100);


		        	})



		            first = false;
		        });
				$.when.apply($,defer_methods).then(function() {
   				    that.render();
             	    that.changedShippingMethod();
             	    if(typeof callback !== 'undefined' )callback();

				})

			}});
		},

		// util method for getting form as an object
		getFormData: function(id) {
			var paramObj = {};
			$.each($(id).serializeArray(), function(_, kv) {
			  paramObj[kv.name] = kv.value;
			});
			return paramObj;
		},
		// util method for finding the index of a checkout step
		findStep: function(name) {
			var whichStep=-1;
			_.each(this.checkout_steps,function(step,k){
			    if(step.name==name) {
				    whichStep=k;
				}
			});
			return whichStep;
		},
		setStepCompleted: function(step,val) {
			if(typeof val == 'undefined') var val = true;
			if (val) {
				//console.log(step + ' completed');
		    }
		    this.checkout_steps[this.findStep(step)].completed=val;
		},
		validateStep: function(name) {
			var step = this.checkout_steps[this.findStep(name)];

			if(name=='review') return true;
            $(step.form).parsley().validate();
            if(!$(step.form).parsley().isValid()) return false;
            return true;
		},
		// open the checkout step and close others. Also deal with edit buttons and step data
		gotoStep: function(name) {
			var that = this;
			if(that.logged_in && name == 'signin') name = 'shipping';
			_.each(this.checkout_steps,function(step,k){
				$(step.edit).hide();
				$('#'+step.name+'-loading' ).show();
				$('#'+step.name+'-panel .step-data').show();
				that.checkout_steps[k].open=false;
				if(step.name!=='review') {
					$('#review-panel #error-text').html('');
                        $('#review-panel #review-text').show();
				}
				if(step.name==name) {
					$.post(acendaBaseUrl + '/api/cart/checkout',{'current_step':name.replace('-','')}).always(function(response){
						setTimeout(function() {
							that.current_step = name;
						    that.checkout_steps[k].open=true;
					     	$('#'+step.name+'-panel .step-data').hide();
		         			$(step.collapse).collapse('show');
							$('#'+step.name+'-panel')[0].scrollIntoView({behavior: 'smooth'});
                           //  $('#'+step.name+'-panel').scrollintoview();
				         	$('#'+step.name+'-loading' ).hide();
				            that.render();
						},100);
					});

				} else {
			        $('#'+step.name+'-loading' ).hide();
					$(step.collapse).collapse('hide');
				}
			});

			if(this.logged_in) {
				$('#billing-save').show();
			}
			else {
				$('#billing-save').hide();
			}
		},
		buildCheckoutForm: function() {
			var that = this;

			function getRandomInt(min, max) {
			    return Math.floor(Math.random() * (max - min + 1)) + min;
			}

			var checkoutForm = {api_unique_token: this.api_unique_token ? this.api_unique_token : getRandomInt(0,9999999) + '-' + getRandomInt(0,9999999) + '-' + getRandomInt(0,9999999) + '-' + getRandomInt(0,9999999) };
			this.api_unique_token = checkoutForm.api_unique_token;
			_.each(this.checkout_steps,function(step) {
				if(typeof step.form !== 'undefined') {
					var formData = that.getFormData(step.form);
					if(step.name === 'shipping') {
						if(that.shipping_states.length) {
							formData['shipping_state'] = formData['shipping_state_select'];
						} else if(formData['shipping_state_text']) {
							formData['shipping_state'] = formData['shipping_state_text'];
						}
					}
					if(step.name === 'payment') {
						if(that.billing_states.length) {
							formData['billing_state'] = formData['billing_state_select'];
						} else if(formData['billing_state_text']) {
							formData['billing_state'] = formData['billing_state_text'];
						}
					}
					checkoutForm = $.extend(checkoutForm,formData);
				}
			});
			checkoutForm = $.extend(checkoutForm,{card_type: that.card_type,card_last4: that.card_last_four});
			checkoutForm = $.extend(checkoutForm,{device_data: JSON.stringify( this.bt_device_data) });
			if(this.logged_in) {
				checkoutForm = $.extend(checkoutForm,{customer_id: this.customer.get('id')});
			}
			return checkoutForm;
		},
		changedAddress: function(e) {
			$(e.target).parents('.panel').find('#address-verify').html('');
		},
		changedShippingCountry: function() {
			var selectedCountry = $('select#shipping-country').val();
			var matchedCountry=this.billing_countries.where({code: selectedCountry}) ;
			if(!matchedCountry.length) {
				$('input[name=copy_shipping_to_billing]').prop('checked',false);
				$('.copy-shipping-flag').hide('fade');
			} else {
				$('.copy-shipping-flag').show('fade');
			}
			//
			var currentCountry = $('#shipping-country').val();
			if (currentCountry == 'US') {
				$('#zip-label').html("Zip Code");
				$('#zip').attr('placeholder','Zip Code');
			} else {
				$('#zip-label').html("Postal Code");
				$('#zip').attr('placeholder','Postal Code');
			}
			//
			this.fetchShippingStates();
		},
		changedBillingCountry: function() {
			//
			var currentCountry = $('#billing-country').val();
			if (currentCountry == 'US') {
				$('#billing-zip-label').html("Zip Code");
				$('#billing-zip').attr('placeholder','Zip Code');
			} else {
				$('#billing-zip-label').html("Postal Code");
				$('#billing-zip').attr('placeholder','Postal Code');
			}
			//
			this.fetchBillingStates();
		},
		changedShippingMethod: function() {
			var method = this.shipping_methods.get($('input[name=shipping_method]:checked').val());
	     	this.cart.set('shipping_rate',method.get('price'));
	     	this.cart.set('shipping_method',method.get('id'));
			this.summaryView.render();
			this.renderShippingMethodSummary();
		},
		changedSavedAddress: function(e,current) {
			var that = this;
			var val = $(e.target).val();
			if(typeof current === 'undefined') {
			    var current = (this.current_step == 'shipping')?'shipping':'billing';
			}
			var copy_fields = ['first_name', 'last_name' ,'street_line1','street_line_2','city','state','zip','phone_number','country'];

			if(current !== 'shipping' && current !=='billing') return;
			$(e.target).parents('.panel').find('#address-verify').html('');
			if(val!='0') {
				var addy = this.customer_addresses.get(val);
				if(!addy) return;
				$('#'+current+ '-address-form .hide-'+current).slideUp();

				if(current =='shipping') {
					that.selected_shipping_address = val;
					var country = addy.get('country');
					// if saved country is not in billing countries then we cant copy the address!
					var matchedCountry=this.billing_countries.where({code: country}) ;
					if(!matchedCountry.length) {
						$('input[name=copy_shipping_to_billing]').prop('checked',false);
						$('.copy-shipping-flag').hide('fade');
					} else {
						$('.copy-shipping-flag').show('fade');
					}
				} else {

					that.selected_billing_address = val;
				}

				_.each(copy_fields,function(field) {
					$('[name=' + current + '_' + field +']').val(addy.get(field));
					if(field=='state') {
				     	$('[name=' + current + '_' + field +'_select]').val(addy.get(field));
				     	$('[name=' + current + '_' + field +'_text]').val(addy.get(field));
					}
				});
			} else {
				$('#'+current+ '-address-form .hide-'+current).slideDown();
			}

		},
		changedLogin: function() {
			$('#signin-error').html(' ');
		},
		checkSignin: function(e) {
			var that = this;
			if(typeof e !== 'undefined') e.preventDefault();

			if(!that.logged_in) {
				if(!that.validateStep('signin')) {
					return;
				}
			}
			var form = that.getFormData('#guest-form');
			$('#create-user-error').html('');
			if(form.create_account) {
				if(form.new_user_password.length<6) {
					 $('#create-user-error').html('Password must be at least 6 characters');
					 return;
				}

				if(form.new_user_password != form.new_user_password_verify) {
					 $('#create-user-error').html('Passwords do not match');
					 return;
				}

			}

			that.renderSigninSummary();
			if(!that.logged_in) {
				$.post(acendaBaseUrl + '/api/cart/checkout',form).always(function(response){
			    	that.setStepCompleted('signin',true);
					that.gotoStep('shipping');
				});
			}
            else {
			    that.setStepCompleted('signin',true);
				that.gotoStep('shipping');
			}
			return false;
		},
		changedCreateAccount: function(e) {
			if($(e.target).is(":checked")) {
				if(typeof $('#newPass').parsley !=='undefined') {
					$('#newPass').parsley('addConstraint', {
	                    required: true
	                });
					$('#newPassVerify').parsley('addConstraint', {
	                    required: true
	                });
				}
				$('#new-user-form').show('fade');
			} else {
				if(typeof $('#newPass').parsley !=='undefined') {
					$('#newPass').parsley('removeConstraint', 'required');
					$('#newPassVerify').parsley('removeConstraint', 'required');
				}
				$('#new-user-form').hide('fade');

			}
		},
		changedCreateAccountPassword: function(e) {
			var form = this.getFormData('#guest-form');
			$('#create-user-error').html('');
			if(form.create_account) {
				if(form.new_user_password.length<6) {
					 $('#create-user-error').html('Password must be at least 6 characters');
					 return;
				}

				if(form.new_user_password != form.new_user_password_verify) {
					 $('#create-user-error').html('Passwords do not match');
					 return;
				}

			}

		},
		changedCopyShippingToBilling: function(e) {
			var that = this;
 			var form = this.getFormData('#shipping-address-form');

 			if(typeof e === 'undefined') {
 				var e = {target: $("input[name=copy_shipping_to_billing]")[0]};

 			}
			if($(e.target).is(":checked")) {
				$("input[name=copy_shipping_to_billing]").each(function()
				{
				    this.checked = true;
				});
				$('.checkoutapp #billing-address').hide();
                $('#billing-customer-addresses-select').val(0);
                $('#billing-address-form .hide-billing').slideDown();

				if(that.shipping_states.length) {
					form['shipping_state'] = form['shipping_state_select'];
				} else if(form['shipping_state_text']) {
					form['shipping_state'] = form['shipping_state_text'];
				}

				$.each(form,function (k,v){
					k = k.replace('shipping_','billing_');
					$('[name="' + k +  '"]').val(v);
				});
			    var tpl = _.template('<div class="col-md-6"><div class="alert alert-info fsd1 mb-3"><button id="btn-edit-billing-address" class="btn btn-info btn-xs float-right">Edit</button><%=shipping_first_name%> <%=shipping_last_name%><br><%=shipping_street_line1%> <%=shipping_street_line2%><br><%=shipping_city%>,<%=shipping_state%> <%=shipping_zip%></div></div>');

				$('div#billing-address-preview').html(tpl(form));
				$('.checkoutapp #payment-panel .copy-shipping-flag').hide();

			} else {
				$('div#billing-address-preview').html('');
				$("input[name=copy_shipping_to_billing]").each(function()
				{
				    this.checked = false;
				});

				$('.checkoutapp #billing-address').show();
				$('.checkoutapp #payment-panel .copy-shipping-flag').show();
			}
		},
		editBillingAddress: function() {
			$('.checkoutapp #payment-panel .copy-shipping-flag input').click();
		},
		goBackToShipping: function(e) {
			var that = this;
			if(typeof e !=='undefined') e.preventDefault();
			this.gotoStep('shipping');
		},
		renderSigninSummary: function() {
			if(!this.checkout_steps[this.findStep('signin')].completed) return;
			var form = this.getFormData('#guest-form');
			if(this.logged_in) {
			    var tpl = _.template('Logged in as <%=first_name%> <%=last_name%>');
                $('#signin-panel .step-data').html(tpl(this.customer.attributes));
                $('input[name=email]').val(this.customer.get('email'));
			} else {
			    var tpl = _.template('<%=email%>');
    			$('#signin-panel .step-data').html(tpl(form));
    		}
		},
		renderShippingAddressSummary: function() {
 			var form = this.getFormData('#shipping-address-form');
			if(typeof form.shipping_state == 'undefined') form.shipping_state = '';
			if(typeof form.shipping_country == 'undefined') form.shipping_country = 'US';
			if(this.shipping_states!==null && this.shipping_states.length) {
				form['shipping_state'] = form['shipping_state_select'];
			} else if(form['shipping_state_text']) {
				form['shipping_state'] = form['shipping_state_text'];
			}

			if(!this.checkout_steps[this.findStep('shipping')].completed) return;
			if(typeof form =='undefined') return;
			if(typeof form.shipping_street_line1 !=='undefined' && form.shipping_street_line1 !=='') {
				var tpl = _.template('<%=shipping_first_name%> <%=shipping_last_name%><br><%=shipping_street_line1%> <%=shipping_street_line2%><br><%=shipping_city%>, <%=shipping_state%> <%=shipping_zip%>');
				$('#shipping-panel .step-data').html(tpl(form));
			}
		},
		renderShippingMethodSummary:  function() {
			if(!this.checkout_steps[this.findStep('shipping-method')].completed || this.cart.get('shipping_method') == null) return;
  			var form = this.getFormData('#shipping-method-form');
			var tpl = _.template('<b><%= method.name %></b><br/><%= method.bottom_days_range %> - <%= method.top_days_range %> days<div class="d-none"><%= method.price %></div>');
			var method = this.shipping_methods.get(form.shipping_method);
			if(typeof method !=='undefined') {
				$('#shipping-method-panel .step-data').html(tpl({method: method.toJSON()}));
				var temp = $('#shipping-methods .val:first').parent('label').html();
				$(temp).find('.val').text($('#shipping-method-panel .step-data .d-none').text());
				$('#shipping-method-panel .step-data').append('<div>'+temp+'</div>');
			}
		},
		renderPaymentSummary: function() {
			if(!this.checkout_steps[this.findStep('payment')].completed) return;
  			var form = this.getFormData('#payment-form');
			if(this.bt_payment_details) {
				$('#payment-panel .step-data').html(this.bt_payment_details);
			}  else if(this.stripe_payment_details) {
				$('#payment-panel .step-data').html(this.stripe_payment_details);
			}else if(typeof form.card_number !== 'undefined'){

 				var tpl = _.template('<%= card_type %> ending in <%= last_four %> expiring on <%= card_exp_month %>/<%= card_exp_year %>');
 				var vars = 	{card_type: this.determinCardType(form.card_number).replace(/^(.)|\s+(.)/g, function ($1) {return $1.toUpperCase()}),card_exp_month: form.card_exp_month,card_exp_year: form.card_exp_year.slice(-2),last_four: form.card_number.slice(-4)};
				this.card_type = vars.card_type;
				this.card_last_four = vars.last_four;
				$('#payment-panel .step-data').html(tpl(vars));
			}
		},
		checkShipping: function(e, dontGo) {
			var that = this;
			if(typeof e !=='undefined') e.preventDefault();
			if(!dontGo && !this.validateStep('shipping')) return;
			if(!dontGo && !this.verifyAddress('shipping')) return;

 			var form = this.getFormData('#shipping-address-form');

 			if(!dontGo) {
	 			if(typeof form.shipping_state == 'undefined') form.shipping_state = '';
				if(typeof form.shipping_country == 'undefined') form.shipping_country = 'US';
				if(that.shipping_states.length) {
					form['shipping_state'] = form['shipping_state_select'];
				} else if(form['shipping_state_text']) {
					form['shipping_state'] = form['shipping_state_text'];
				}
				if(that.logged_in) {
					form.shipping_address_selected = $('#shipping-customer-addresses-select').val();
 				}
			}
            if($('input[name=copy_shipping_to_billing]').is(":checked")) {
            	form.copy_shipping=1;
            } else {
            	form.copy_shipping=0;
            }
			if(!form['shipping_state']) form['shipping_state'] = form['shipping_state_text'];

			if($('input[name=copy_shipping_to_billing]').is(":checked")) {
				$('.checkoutapp #billing-address').hide();
				$.each(form,function (k,v){
					k = k.replace('shipping_','billing_');

					$('[name="' + k +  '"]').val(v);
				});
			} else {
				$('.checkoutapp #billing-address').show();
			}
            $('#shipping-methods').html('<div style="margin: auto; padding: 12px 15px; color: #ddd; text-align: center;" ><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>');

			$.post(acendaBaseUrl + '/api/cart/checkout',form).always(function(response){
				that.fetchCart(function() {  that.fetchShippingMethods(); });
				that.setStepCompleted('shipping',true);
				if(!dontGo) that.gotoStep('shipping-method');
			});

			return false;
		},
		checkShippingMethod: function(e) {
			var that = this;
			if(typeof e !=='undefined') e.preventDefault();
			if(!this.validateStep('shipping-method')) return;
  			var form = this.getFormData('#shipping-method-form');
			that.setStepCompleted('shipping-method',true);
			$.post(acendaBaseUrl + '/api/cart/checkout',form).always(function(response){
				that.fetchCart();
		    	that.gotoStep('payment');
			});


			return false;
		},
		checkPayment: function(e) {
			var that = this;
			if(typeof e !=='undefined') e.preventDefault();
			if(!this.validateStep('payment')) return;
			if(!$('input[name=copy_shipping_to_billing]').is(":checked")) {
			    if(!this.verifyAddress('payment')) return;
			}
  			var form = this.getFormData('#payment-form');
			if(that.logged_in) {
				form.billing_address_selected = $('#billing-customer-addresses-select').val();
			}
            if($('input[name=copy_shipping_to_billing]').is(":checked")) {
            	form.copy_shipping=1;
            } else {
            	form.copy_shipping=0;
            }
			if(typeof form.card_number !=='undefined') {
		        var currentTime = new Date()
		        var month = currentTime.getMonth() + 1
		        var year = currentTime.getFullYear();
	            if($('select#exp-y').val() == year && parseInt($('select#exp-m').val()) < month)
	            {
	                $(this).find('button[type="submit"]').attr('disabled', false).removeClass('wait');
	                $('select#exp-y').parent().addClass('has-error');
	                $('select#exp-m').parent().addClass('has-error');
	                return false;
	            } else {
	                 $('select#exp-y').parent().removeClass('has-error');
	                 $('select#exp-m').parent().removeClass('has-error');
	            }
		     	that.setStepCompleted('payment',true);
                if($('input[name=copy_shipping_to_billing]').is(":checked")) {
                	form.copy_shipping=1;
                } else {
                	form.copy_shipping=0;
                }
				$.post(acendaBaseUrl + '/api/cart/checkout',form).always(function(response){
		     	     that.gotoStep('review');
				});
			} 
			else if(acendaPaymentPlatform.toLowerCase()=='stripe') 
			{
				  that.stripe.createToken(that.stripe_card).then(function(result) {
				    if (result.error) {
				      // Inform the customer that there was an error.
				      var errorElement = document.getElementById('card-errors');
				      errorElement.textContent = result.error.message;
				    } else {
						$('#nonce').val(result.token.id);	
					    console.log('stripe result',result);	
					    if(typeof result.token.card !== 'undefined') {
				            that.stripe_payment_details = result.token.card.brand + " Card ending in " + result.token.card.last4;
				            that.card_last_four = result.token.card.last4;
				            that.card_type = result.token.card.brand
				        }
		            	that.setStepCompleted('payment',true);
						$.post(acendaBaseUrl + '/api/cart/checkout',form).always(function(response){
				     	     that.gotoStep('review');
						});	
				    }
				  });
			}
			else if (acendaPaymentPlatform.toLowerCase()=='braintree'){
			    that.bt_dropin_instance.requestPaymentMethod(function(err, payload) {
				        $('#nonce').val(payload.nonce);
				        if(typeof payload.deviceData !== 'undefined' ) {
				        	that.bt_device_data = payload.deviceData;
				        }
				        if(payload.type=="CreditCard") {
				            that.bt_payment_details = payload.details.cardType + " Card ending in " + payload.details.lastFour;
				            that.card_last_four = payload.details.lastFour;
				            that.card_type = payload.details.cardType;
				        }
				        if(payload.type=="PayPalAccount") {
				            that.card_type = 'paypal';
				            that.card_last_four = payload.details.email;
				            that.bt_payment_details = "Paypal: " + payload.details.email;
				        }
		            	that.setStepCompleted('payment',true);
						$.post(acendaBaseUrl + '/api/cart/checkout',form).always(function(response){
				     	     that.gotoStep('review');
						});
				});
			}

			return false;
		},
		placeOrder: function(e) {
			e.preventDefault();
			var that = this;
			var form = this.buildCheckoutForm();
            $("html, body").animate({ scrollTop: 0 }, "slow");
			$('.checkoutapp #checkout-steps').fadeOut();
			$('.checkoutapp #summary-panel').fadeOut();
			$('.checkoutapp #processing').slideDown();
			$("#checkout_process_percent").removeClass("progress-bar-danger");
			$(".checkoutapp #checkout_process_percent").width('0px');

			$.post(acendaBaseUrl + '/api/order/place',form).done(function(response) {
                 setTimeout(retryOrderProcess, 1000);

			}).fail(function (){
                 setTimeout(retryOrderProcess, 1000);
			});

		    var checkoutProcessPercent = 0;
		    var checkoutProgressbar = function () {
		        setTimeout(function () {
		            var percent = Math.ceil(checkoutProcessPercent*100);
		            $(".checkoutapp #checkout_process_percent").width(percent+"%");
		            $(".checkoutapp #checkout_process_percent_text").text(percent+"% Complete")
		            if(checkoutProcessPercent < 1) {
		                checkoutProgressbar();
		                checkoutProcessPercent += 0.01;
		            }
		        }, 100);
		    }
			var retryOrderProcess = function() {

				$.post(acendaBaseUrl + '/api/order/place',{api_unique_token: that.api_unique_token }).done(function(response) {
					// Order Successful
					if(typeof response.result == 'undefined') {
	                      checkoutProcessPercent += 0.05;
					      setTimeout(retryOrderProcess, 2000);
					      return;
	                }
					checkoutProcessPercent = 1;
                    $('.checkoutapp #processing').slideUp();

                    /* redirect to oldschool thankyou page rather than having a single page thanktou */

			        var vform = '';
			        var args = {order_number: response.result.order_number,email: response.result.email  };
			        var location = acendaBaseUrl + '/checkout/place';
			        $.each( args, function( key, value ) {
			            value = value.split('"').join('\"')
			            vform += '<input type="hidden" name="'+key+'" value="'+value+'">';
			        });
 					$.ajax({url: acendaBaseUrl + '/api/cart',type: 'DELETE'}).done(function() {
 						$('<form action="' + location + '" method="POST">' + vform + '</form>').appendTo($(document.body)).submit();
					});

				}).fail(function(response) {
					response = response.responseJSON;
	                if(response.code == 406) {
	                      checkoutProcessPercent += 0.05;
					      setTimeout(retryOrderProcess, 2000);
	                } else {
	                    checkoutProcessPercent = 1;
	                    $("#checkout_process_percent").addClass("progress-bar-danger");
	                    $("#checkout_process_percent").width("100%");
	                    $('.checkoutapp #processing').slideUp();
						$('.checkoutapp #checkout-steps').fadeIn();
						$('.checkoutapp #summary-panel').fadeIn();
						that.api_unique_token = null;
                        $('#review-panel #review-text').hide();
						$('#review-panel')[0].scrollIntoView({behavior: 'smooth'});                        
						$('#review-panel #error-text').html('<p>Unfortunately we were unable to complete your order.<br/>Please review the errors below and correct any mistakes in the steps above. <br/>If you are still unable to checkout, please <a href="' + acendaBaseUrl + '/contact" target="_blank">contact us</a> for assistance.</p>');
						if(typeof response.error == 'string') {
						    $('#review-panel #error-text').append('<ul><li>'+response.error +'</li></uL>');					
						} else if (typeof response.error=='object') {
							var elem = '<ul>';
							for (var property in response.error) {
							    if (response.error.hasOwnProperty(property)) {
						        	elem += '<li>'+property.replace('_',' ').toLowerCase().replace(/^(.)|\s(.)/g, ($1) => $1.toUpperCase()) + ' - '+response.error[property]+'</li>';
							    }
							}
							elem += '</ul>';

							$('#review-panel #error-text').append(elem);
						}					
	                }
				});

			}
		    checkoutProgressbar();

			return false;
		},
		login: function(e) {
			var that = this;
			e.preventDefault();
			var form = this.getFormData('#login-form');
            $('#signin-error').html('');
            $('#btn-login-signin').attr('disabled',true);
            var oldBtnText  = $('#btn-login-signin').html();
            $('#btn-login-signin').html('<i class="fas fa-cog fa-spin"></i>');

			$.post(acendaBaseUrl + '/api/customer/login', $('#login-form').serialize()).done(function(response) {
				if(response.code == 200) {
					that.logged_in=true;
					that.fetchCart(function() {
					that.logged_in=true;
						that.fetchCustomer(function() {
							that.setStepCompleted('signin',true);
				     		that.setupBrainTree();
				     		that.setupStripe();
							that.reloadToolbar();
							that.gotoStep('shipping');
						});
					});

				}
			}).fail(function(response){
				$('#signin-error').html(response.responseJSON.error.password[0]);

			}).always(function() {
                 $('#btn-login-signin').html(oldBtnText);
                 $('#btn-login-signin').attr('disabled',false);
			});
			return false;
		}
	});
})(jQuery);
