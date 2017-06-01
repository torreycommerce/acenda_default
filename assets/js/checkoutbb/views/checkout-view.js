var checkout = checkout || {};

(function ($) {
	'use strict';
	checkout.CheckoutView = Backbone.View.extend({
		el: '.checkoutapp',
		summaryView: null,
		cart: new checkout.Cart(),
		shipping_countries: null,
		shipping_states: null,
		customer: new checkout.Customer(),
		customer_addresses: new checkout.CustomerAddresses(),
		shipping_methods: new checkout.ShippingMethods(),
		logged_in: false,
		api_unique_token: null,
		current_step: 'signin',
		checkout_steps: [
		    {name: 'signin', form: '#guest-form', collapse: '#collapseSignIn', edit: '#btn-edit-signin', completed: false, open: false},
		    {name: 'shipping', form: '#shipping-address-form', collapse: '#collapseShipping', edit: '#btn-edit-shipping' , completed: false, open: false},
		    {name: 'shipping-method', form: '#shipping-method-form', collapse: '#collapseShippingMethod', edit: '#btn-edit-shipping-method' , completed: false, open: false},
		    {name: 'payment', form: '#payment-form', collapse: '#collapsePayment',edit: '#btn-edit-payment', completed: false, open: false},
		    {name: 'review', collapse: '#collapseReview', edit: '#btn-edit-review' , completed: false, open: false}
		],
		events: {
			'click #btn-continue-signin' : 'checkSignin',
			'click #btn-login-signin' : 'login',			
			'click #btn-continue-shipping' : 'checkShipping',
			'click #btn-continue-shipping-method' : 'checkShippingMethod',
			'click #btn-continue-payment' : 'checkPayment',	
			'click #btn-place-order' : 'placeOrder',
			'change #shipping-country' : 'changedShippingCountry',
			'change #customer-addresses select' : 'changedSavedAddress',
			'change #login-form input' : 'changedLogin'	,
			'change input[name=shipping_method]' : 'changedShippingMethod',									
		},
		initialize: function () {
			var that = this;
			this.summaryView = new checkout.SummaryView();
			this.cart.on('change',function(e) {
				if(that.cart.ready === true ) {
				    that.render();
			    }
			}); 
			this.customer.on('change',function(e) {
				if(that.customer.get('email')) that.logged_in=true;
				else that.logged_in=false;
				that.checkSignin();
				if(!that.logged_in) this.gotoStep('signin');
			}); 
			// setup edit buttons
			_.each(this.checkout_steps,function(step,k){ 
				$(step.edit).click(function() {
					that.gotoStep(step.name);
				})
			});

			this.fetchCart();
			this.fetchCustomer();
			this.fetchShippingCountries();
		},
		render: function () {
			var that = this;

			$('.btn-edit').css({display: 'none'});
			_.each(this.checkout_steps,function(step){ 
				 if( !(step.name=='signin' && that.logged_in) && (step.completed && !step.open)) {
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
	                $('#billing-country').append(tpl({country:country,current: currentCountry}));	                
				});
			}

		    if(this.shipping_states !== null && $('#shipping-state').children().length<2 ) {
				this.shipping_states.each(function (state) {
					var tpl = _.template('<option value="<%=state.get("value")%>"><%=state.get("label")%></option>');
	                $('#shipping-state').append(tpl({state:state}));
	                $('#billing-state').append(tpl({state:state}));	                
				});
				if(!this.shipping_states.length) {
					$('#shipping-state').parent().fadeOut();
				} else {
					$('#shipping-state').parent().fadeIn();
				}
			}
			this.summaryView.render();
		},
		// Fetch current cart state
		fetchCart: function () {   
		    this.cart.fetch();	
		},
		// Fetch current cart state
		fetchCustomer: function () {   
			var that = this;				
		    this.customer.fetch({error: function() {  that.gotoStep('signin'); that.logged_in=false;  },success: function(data) {
		    	that.customer_addresses.fetch({success: function() {
                    that.logged_in=true; that.checkSignin();
                    if(that.customer_addresses.length) {
                    	var tpl = _.template('<option value="<%= id %>"><%= one_line %></option> ');
                    	$('[id=customer-addresses]').show();
                    	$('#customer-addresses select').html('<option value selected >none</option>');
                    	that.customer_addresses.each(function(addy){
                    		console.log(addy);
                    		$('#customer-addresses select').append(tpl(addy.toJSON()));
                    	});
                    } else {
                    	$('[id=customer-addresses]').hide();
                    }
		    	}});
		    }});	
		},
		reloadToolbar: function() {
			console.log('reload toolbar');
			$.get(acendaBaseUrl+'/account/toolbar', function(data) {
				$('.toolbarajax').html(data);
		    });
		},
		fetchShippingCountries: function() {
			var that = this;			
			this.shipping_countries = new checkout.ShippingCountries();
			this.shipping_countries.fetch({success: function() {
                $('#shipping-country').html('<option disabled selected>Select a Country</option>');				
				that.render();
				that.fetchShippingStates();
			}});
		},
		fetchShippingStates: function() {
			var that = this;			
			this.shipping_states = new checkout.ShippingStates();
			this.shipping_states.fetch({url: this.shipping_states.url + '/' + $('#shipping-country').val() ,success: function() {
		        $('#shipping-state').html('<option disabled selected>Select a State</option>');				
				that.render();
			}});
		},
		fetchShippingMethods: function() {
			var that = this;
			var tpl = _.template($('#shipping-methods-template').html());
			this.shipping_methods.fetch({data: {country:  $('#shipping-country').val() ,state: $('#shipping-state').val()} ,success: function(data) {
		        $('#shipping-methods').html(tpl({methods: that.shipping_methods.toJSON()}));
		        var total = that.cart.get('item_subtotal');
		        var quantity = that.cart.get('item_count');

		        that.shipping_methods.each(function(method,k){
		        	$.post(acendaBaseUrl + '/api/shippingmethod/' + method.id +  '/rate',{total: total,quantity: quantity}, function(response) {
		        	    that.shipping_methods.at(k).set('price',response.result.rate);
		                $('#shipping-methods').html(tpl({methods: that.shipping_methods.toJSON()}));	              
		        	})
		        });		
		        $('#shipping-methods').html(tpl({methods: that.shipping_methods.toJSON()}));		      		        	
				that.render();
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
		validateStep: function(name) {
			var step = this.checkout_steps[this.findStep(name)];

            $(step.form).parsley().validate();
            if(!$(step.form).parsley().isValid()) return false; 	
            return true;
		},
		// open the checkout step and close others. Also deal with edit buttons and step data
		gotoStep: function(name) {
			var that = this;
             //$("*").stop(true, true);			
			_.each(this.checkout_steps,function(step,k){
				$(step.collapse).collapse('hide');
				$('#'+step.name+'-panel .step-data').show();
				that.checkout_steps[k].open=false;
				if(step.name==name) {
					that.current_step = name;
				    that.checkout_steps[k].open=true;					
					$(step.collapse).collapse('show');
			     	$('#'+step.name+'-panel .step-data').hide();	

				}
			});
			that.render();
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
					checkoutForm = $.extend(checkoutForm,formData);
				}
			});	
			console.log(checkoutForm);
			return checkoutForm;
		},
		changedShippingCountry: function() {
			this.fetchShippingStates();
		},
		changedShippingMethod: function() {
			var method = this.shipping_methods.get($('input[name=shipping_method]:checked').val());
			this.cart.set('shipping_rate',method.get('price'));
			this.summaryView.render();
		},		
		changedSavedAddress: function(e) {
			console.log(e);
			var val = $(e.target).val();
			var current = (this.current_step == 'shipping')?'shipping':'billing';
			var copy_fields = ['first_name', 'last_name' ,'street_line1','street_line_2','city','state','zip','phone_number'];

			if(current !== 'shipping' && current !=='billing') return;

			if(val) {
				$('#'+current+ '-address-form .hide-shipping').slideUp();
				var addy = this.customer_addresses.get(val);
				_.each(copy_fields,function(field) {
					$('[name=' + current + '_' + field +']').val(addy.get(field));

				});
			} else {
				$('#'+current+ '-address-form .hide-shipping').slideDown();
			}

		},
		changedLogin: function() {
			$('#signin-error').html(' ');
		},	
		checkSignin: function(e) {
			if(typeof e !== 'undefined') e.preventDefault();

			if(!this.logged_in) {
				if(!this.validateStep('signin')) {				
					return;
				}
			}
			var form = this.getFormData('#guest-form');


			if(this.logged_in) {
			    var tpl = _.template('Logged in as <%=first_name%> <%=last_name%> ');				
                $('#signin-panel .step-data').html(tpl(this.customer.attributes));
                $('input[name=email]').val(this.customer.get('email'));
			} else {
			    var tpl = _.template('<%=email%>');				
    			$('#signin-panel .step-data').html(tpl(form));
    		}
			this.checkout_steps[this.findStep('signin')].completed=true;
			this.gotoStep('shipping');
			return false;
		},
		checkShipping: function(e) {
			var that = this;
			e.preventDefault();
			if(!this.validateStep('shipping')) return;

 			var form = this.getFormData('#shipping-address-form');
 			if(typeof form.shipping_state == 'undefined') form.shipping_state = 'CA';
			if(typeof form.shipping_country == 'undefined') form.shipping_country = 'US'; 			
			var tpl = _.template('<%=shipping_first_name%> <%=shipping_last_name%><br><%=shipping_street_line1%> <%=shipping_street_line2%><br><%=shipping_city%>,<%=shipping_state%> <%=shipping_zip%>');
			$('#shipping-panel .step-data').html(tpl(form));
			if($('input[name=copy_shipping_to_billing]').is(":checked")) {
				$('.checkoutapp #billing-address').hide();
				$.each(form,function (k,v){
					k = k.replace('shipping_','billing_');
			
					$('[name="' + k +  '"]').val(v);
				});
			} else {
				$('.checkoutapp #billing-address').show();
			}
			this.fetchShippingMethods();
			this.checkout_steps[this.findStep('shipping')].completed=true;
			$.post(acendaBaseUrl + '/api/cart/checkout',form).done(function(response){
				that.fetchCart();
				that.changedShippingMethod();
			});


			this.gotoStep('shipping-method');
			return false;
		},
		checkShippingMethod: function(e) {
			var that = this;			
			e.preventDefault();
			if(!this.validateStep('shipping-method')) return;
  			var form = this.getFormData('#shipping-method-form');		
			var tpl = _.template('<b><%= method.name %></b><br/><%= method.bottom_days_range %> - <%= method.top_days_range %> days<br/>$<%= method.price %>');

			var method = this.shipping_methods.get(form.shipping_method);
			$('#shipping-method-panel .step-data').html(tpl({method: method.toJSON()}));
			this.checkout_steps[this.findStep('shipping-method')].completed=true;
			$.post(acendaBaseUrl + '/api/cart/checkout',form).always(function(response){
				console.log('fetching cart')
				that.fetchCart();
			});
	
			this.gotoStep('payment');
			return false;
		},
		checkPayment: function(e) {
			e.preventDefault();
			if(!this.validateStep('payment')) return;
 
			this.checkout_steps[this.findStep('payment')].completed=true;
			this.gotoStep('review');
            $("html, body").animate({ scrollTop: 0 }, "slow");			
			return false;
		},
		placeOrder: function(e) {			
			e.preventDefault();
			var that = this;
			var form = this.buildCheckoutForm();
			$('.checkoutapp #checkout-steps').fadeOut();
			$('.checkoutapp #summary-panel').fadeOut();			
			$('.checkoutapp #processing').slideDown();
			$("#checkout_process_percent").removeClass("progress-bar-danger");
			$(".checkoutapp #checkout_process_percent").width('0px');

			$.post(acendaBaseUrl + '/api/order/place',form).done(function(response) {
				console.log('success');
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

					if(typeof response.result == 'undefined') {
	                      checkoutProcessPercent += 0.05;
					      setTimeout(retryOrderProcess, 2000);
					      return;
	                }
					checkoutProcessPercent = 1;
					var tpl = _.template($('#thank-you-template').html());
                    $('.checkoutapp #processing').slideUp();
                    $('#thankyou').html(tpl({order: response.result})).slideDown();   
					$.ajax({url: acendaBaseUrl + '/api/cart',type: 'DELETE'}).done(function() {
 						that.reloadToolbar();
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
						$('#review-panel #error-text').html('Unfortunately we were unable to complete your order. Please review your address and bank information to ensure it is correct. If it is correct, please <a href="' + acendaBaseUrl + '/contact" target="_blank">contact us</a> for assistance.'); 	                    
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
            $('#btn-login-signin').html('<i class="fa fa-gear fa-spin"></i>');

			$.post(acendaBaseUrl + '/api/customer/login', $('#login-form').serialize()).done(function(response) {
				if(response.code == 200) {
					that.fetchCustomer();
				} 				
			}).fail(function(response){
				console.log(response.responseJSON);
				$('#signin-error').html(response.responseJSON.error.password[0]);

			}).always(function() {
                 $('#btn-login-signin').html(oldBtnText);
                 $('#btn-login-signin').attr('disabled',false);
			});
			return false;
		}	
	});
})(jQuery);