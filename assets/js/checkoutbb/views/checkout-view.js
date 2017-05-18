var checkout = checkout || {};

(function ($) {
	'use strict';
	checkout.CheckoutView = Backbone.View.extend({
		el: '.checkoutapp',
		summaryView: null,
		cart: new checkout.Cart(),
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
		},
		initialize: function () {
			var that = this;
			this.summaryView = new checkout.SummaryView();
			this.getCart();

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
			this.summaryView.render();		    	
		},
		// Fetch current cart state
		getCart: function () {   
		    this.cart.fetch();	
		},
		findStep: function(name) {
			var whichStep=-1;
			_.each(this.checkoutSteps,function(step,k){ 
			    if(step.name==name) {
				    whichStep=k;
				}
			});
			return whichStep;
		},
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
		checkSignin: function(e) {
			e.preventDefault();

 
			this.checkoutSteps[this.findStep('signin')].completed=true;
			this.gotoStep('shipping');
			return false;
		},
		checkShipping: function(e) {
			e.preventDefault();

 
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