var checkout = checkout || {};

(function ($) {
	'use strict';
	checkout.CheckoutView = Backbone.View.extend({
		el: '.checkoutapp',
		summaryView: null,
		cart: new checkout.Cart(),
		shipping_countries: [],
		shipping_states: [],		
		checkoutSteps: [
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

			_.each(this.checkoutSteps,function(step,k){ 
				$(step.edit).click(function() {
					that.gotoStep(step.name);
				})
			});			
			this.gotoStep('signin');
		},
		render: function () {
			$('.btn-edit').css({display: 'none'});
			_.each(this.checkoutSteps,function(step){ 
				 if(step.completed && !step.open) {
				 	 $(step.edit).show();
				 } else {
				 	 $(step.edit).hide();				 	
				 }
			});
		    $('#shipping-country').html();
			this.shipping_countries.each(function (country) {
				var tpl = _.template('<option value="<%=country.get("value")%>"><%=country.get("label")%></option>');
               $('#shipping-country').append(tpl({country:country}));

			});
		    $('#shipping-state').html();
			this.shipping_states.each(function (state) {
				var tpl = _.template('<option value="<%=state.get("value")%>"><%=state.get("label")%></option>');
               $('#shipping-state').append(tpl({state:state}));

			});


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
				that.render();
			}});
		},
		getShippingStates: function() {
			var that = this;			
			this.shipping_states = new checkout.ShippingStates();
			this.shipping_states.fetch({data:{},success: function() {
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
			_.each(this.checkoutSteps,function(step,k){ 
			    if(step.name==name) {
				    whichStep=k;
				}
			});
			return whichStep;
		},
		// open the checkout step and close others. Also deal with edit buttons and step data
		gotoStep: function(name) {
			var that = this;
			_.each(this.checkoutSteps,function(step,k){
				$(step.collapse).collapse('hide');
				$('#'+step.name+'-panel .step-data').show();
				that.checkoutSteps[k].open=false;
				if(step.name==name) {
				    that.checkoutSteps[k].open=true;					
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
			// $('#guest-form').parsley().validate();
			// if(!$('#guest-form').parsley().isValid()) return;
			var form = this.getFormData('#guest-form');
			var tpl = _.template('<%=email%>');
			$('#signin-panel .step-data').html(tpl(form));
 
			this.checkoutSteps[this.findStep('signin')].completed=true;
			this.gotoStep('shipping');
			return false;
		},
		checkShipping: function(e) {
			e.preventDefault();

            // $('#shipping-address-form').parsley().validate();
            // if(!$('#shipping-address-form').parsley().isValid()) return;            		
 			var form = this.getFormData('#shipping-address-form');
 			if(typeof form.state == 'undefined') form.state = 'CA';
			if(typeof form.country == 'undefined') form.country = 'US'; 			
			var tpl = _.template('<%=first_name%> <%=last_name%><br><%=street_line_1%> <%=street_line_2%><br><%=city%>,<%=state%> <%=zip%>');
			$('#shipping-panel .step-data').html(tpl(form));


			this.checkoutSteps[this.findStep('shipping')].completed=true;
			this.gotoStep('shipping-method');
			return false;
		},
		checkShippingMethod: function(e) {
			e.preventDefault();

 
			this.checkoutSteps[this.findStep('shipping-method')].completed=true;
			this.gotoStep('payment');
			return false;
		},
		checkPayment: function(e) {
			e.preventDefault();

 
			this.checkoutSteps[this.findStep('payment')].completed=true;
			this.gotoStep('review');
            $("html, body").animate({ scrollTop: 0 }, "slow");			
			return false;
		},
		placeOrder: function(e) {
			e.preventDefault();


			return false;
		},
		login: function(e) {
			e.preventDefault();


			return false;
		}	
	});
})(jQuery);