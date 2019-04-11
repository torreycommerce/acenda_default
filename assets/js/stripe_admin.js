
var _paymentMethods = null;

var paymentMethodModel = Backbone.Model.extend({




});
var paymentMethodCollection = Backbone.Model.extend({
	model: 'paymentMethodModel',
	fetch: function() {


	}
});

var paymentMethodsView = Backbone.View.extend({
	el: '#payment-methods',
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
	events: {
		"click .icon":          "open",
		"click .button.edit":   "openEditDialog",
		"click .button.delete": "deletePaymentMethod",
		"click #button-add-creditcard" : "openAddCreditCard",
		"click #button-add-paypal" : "openAddPaypal",		
		"click .pm-delete" : "deletePaymentMethod",	
		"click .pm-update" : "updatePaymentMethod",					
	},

	initialize: function() {
		var that = this;
		if(typeof Stripe !=='undefined') {
            that.setupStripe();			
		}


	},
	openAddCreditCard: function(e) {
		var that = this;
        var form = document.querySelector('#create-card-form');
        var submit = document.querySelector('#card-submit-btn');      
		var elm = $(e.currentTarget);	
        $('div#payment-methods').fadeOut('fast',function() {
			$('div#payment-platforms').hide();
			$('div#stripe-fields-form').show();
        });
        form.addEventListener('submit', function (event) {
			var originalText  =  $('#card-submit-btn').html();

			event.preventDefault();	            
			$('#card-submit-btn').html('<i class="fas fa-cog fa-spin"> </i>')		            
			$('#card-submit-btn').prop('disabled',true);	
			that.stripe.createToken(that.stripe_card).then(function(result) {
			if (result.error) {
			  // Inform the customer that there was an error.
			  var errorElement = document.getElementById('card-errors');
			  errorElement.textContent = result.error.message;
        		$('#card-submit-btn').prop('disabled',false);			  
			} else {

				$('#nonce').val(result.token.id);
		      	var nonce = result.token.id;			
			    $.get(acendaBaseUrl + '/account/payment-methods/create/' + nonce,function(data) { 
			        location.reload();				   
			    });
		    
			}
			});
		});
		form.addEventListener('reset', function (event) {
		  event.preventDefault();	 
		  location.reload();	                        		               
		});
        $('#card-submit-btn').prop('disabled',false);	
	},
	updatePaymentMethod : function(e) {
		var elm = $(e.currentTarget);
        var token = elm.attr('id').split("-").pop(-1);	
        console.log(token);

	},
	deletePaymentMethod : function(e) {
		var elm = $(e.currentTarget);
        var token = elm.attr('id').split("-").pop(-1);	
        if(confirm('Are you sure you would like to delete this payment method?')) {
        	    elm.html('<i class="fas fa-cog fa-spin"></i>')
			    $.get(acendaBaseUrl + '/account/payment-methods/delete/' + token,function(data) {
					elm.closest('tr').find('td').fadeOut('slow', 
					        function(here){ 
					            $(here).parents('tr:first').remove();                    
					        }); 
			    });
	    }
	},
	setupStripe: function() {
		
	  var that = this;			
        if(typeof acendaPaymentPlatform !== 'undefined' && acendaPaymentPlatform.toLowerCase()!='stripe') return;
		$.post(acendaBaseUrl+'/api/stripe/getpk', function(data) {
				var pk = data.result.pk;
				that.stripe = Stripe(pk);
				that.stripe_elements = that.stripe.elements();

			// Create an instance of the card Element.
				if(that.stripe_card == null) {
			    	that.stripe_card = that.stripe_elements.create('card', {style: that.stripe_style});
			    } else {
			    	that.stripe_card.unmount();
			    }
				console.log('stripe_card',that.stripe_card);	
				// Add an instance of the card Element into the `card-element` <div>.
				that.stripe_card.mount('#card-element');
				that.stripe_card.addEventListener('change', function(event) {
				  var displayError = document.getElementById('card-errors');
				  if (event.error) {
				    displayError.textContent = event.error.message;
				  } else {
				    displayError.textContent = '';
				  }
				});	
		});	
	},	
	render: function() {
	    return this;
	}
});



$(document).ready(function() {

	var pmv = new paymentMethodsView();
	pmv.render();
});