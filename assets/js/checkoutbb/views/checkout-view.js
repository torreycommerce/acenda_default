var checkout = checkout || {};

(function ($) {
	'use strict';
	checkout.CheckoutView = Backbone.View.extend({
		el: '.checkoutapp',
		summaryView: null,
		cart: new checkout.Cart(),
		shipping_countries: null,
		shipping_states: null,		
		checkout_steps: [
		    {name: 'signin', collapse: '#collapseSignIn', edit: '#btn-edit-signin', completed: false, open: false},
		    {name: 'shipping', collapse: '#collapseShipping', edit: '#btn-edit-shipping' , completed: false, open: false},
		    {name: 'shipping-method', collapse: '#collapseShippingMethod', edit: '#btn-edit-shipping-method' , completed: false, open: false},
		    {name: 'payment', collapse: '#collapsePayment',edit: '#btn-edit-payment', completed: false, open: false},
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
		},
		initialize: function () {
			var that = this;
			this.summaryView = new checkout.SummaryView();
			this.getCart();
			this.getShippingCountries();
			this.cart.on('change',function(x) {
				if(that.cart.ready === true ) {
				    that.render();
			    }
			}); 

			_.each(this.checkout_steps,function(step,k){ 
				$(step.edit).click(function() {
					that.gotoStep(step.name);
				})
			});			
			this.gotoStep('signin');
		},
		render: function () {
			$('.btn-edit').css({display: 'none'});
			_.each(this.checkout_steps,function(step){ 
				 if(step.completed && !step.open) {
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

		    if(this.shipping_states !== null && $('#shipping-state').children().length<2 ) {
				this.shipping_states.each(function (state) {
					var tpl = _.template('<option value="<%=state.get("value")%>"><%=state.get("label")%></option>');
	                $('#shipping-state').append(tpl({state:state}));
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
		getCart: function () {   
		    this.cart.fetch();	
		},
		getShippingCountries: function() {
			var that = this;			
			this.shipping_countries = new checkout.ShippingCountries();
			this.shipping_countries.fetch({success: function() {
                $('#shipping-country').html('<option disabled selected>Select a Country</option>');				
				that.render();
				that.getShippingStates();
			}});
		},
		getShippingStates: function() {
			var that = this;			
			this.shipping_states = new checkout.ShippingStates();
			this.shipping_states.fetch({url: this.shipping_states.url + '/' + $('#shipping-country').val() ,success: function() {
		        $('#shipping-state').html('<option disabled selected>Select a State</option>');				
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
		// open the checkout step and close others. Also deal with edit buttons and step data
		gotoStep: function(name) {
			var that = this;
			_.each(this.checkout_steps,function(step,k){
				$(step.collapse).collapse('hide');
				$('#'+step.name+'-panel .step-data').show();
				that.checkout_steps[k].open=false;
				if(step.name==name) {
				    that.checkout_steps[k].open=true;					
					$(step.collapse).collapse('show');
			     	$('#'+step.name+'-panel .step-data').hide();	

				}
			});
			that.render();
		},
		changedShippingCountry: function() {
			this.getShippingStates();
		},
		checkSignin: function(e) {
			e.preventDefault();
			$('#guest-form').parsley().validate();
			if(!$('#guest-form').parsley().isValid()) return;
			var form = this.getFormData('#guest-form');
			var tpl = _.template('<%=email%>');
			$('#signin-panel .step-data').html(tpl(form));
 
			this.checkout_steps[this.findStep('signin')].completed=true;
			this.gotoStep('shipping');
			return false;
		},
		checkShipping: function(e) {
			e.preventDefault();

            $('#shipping-address-form').parsley().validate();
            if(!$('#shipping-address-form').parsley().isValid()) return;            		
 			var form = this.getFormData('#shipping-address-form');
 			if(typeof form.state == 'undefined') form.state = 'CA';
			if(typeof form.country == 'undefined') form.country = 'US'; 			
			var tpl = _.template('<%=first_name%> <%=last_name%><br><%=street_line_1%> <%=street_line_2%><br><%=city%>,<%=state%> <%=zip%>');
			$('#shipping-panel .step-data').html(tpl(form));


			this.checkout_steps[this.findStep('shipping')].completed=true;
			this.gotoStep('shipping-method');
			return false;
		},
		checkShippingMethod: function(e) {
			e.preventDefault();

 
			this.checkout_steps[this.findStep('shipping-method')].completed=true;
			this.gotoStep('payment');
			return false;
		},
		checkPayment: function(e) {
			e.preventDefault();

 
			this.checkout_steps[this.findStep('payment')].completed=true;
			this.gotoStep('review');
            $("html, body").animate({ scrollTop: 0 }, "slow");			
			return false;
		},
		placeOrder: function(e) {
			e.preventDefault();
			$('#checkout-steps').fadeOut();
			$('#summary-panel').fadeOut();			
			$('#processing').slideDown();

		    var checkoutProcessPercent = 0;

		    function checkoutProgressbar() {
		        setTimeout(function () {
		            console.log(checkoutProcessPercent);
		            var percent = Math.ceil(checkoutProcessPercent*100);
		            $("#checkout_process_percent").width(percent+"%");
		            $("#checkout_process_percent_text").text(percent+"% Complete")
		            if(checkoutProcessPercent < 1) {
		                checkoutProgressbar();
		                checkoutProcessPercent += 0.01;
		            }
		        }, 100);
		    }
		    checkoutProgressbar();

			return false;
		},
		login: function(e) {
			e.preventDefault();


			return false;
		}	
	});
})(jQuery);