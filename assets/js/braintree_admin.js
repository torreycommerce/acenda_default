
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
	events: {
		"click .icon":          "open",
		"click .button.edit":   "openEditDialog",
		"click .button.delete": "destroy",
		"click #button-add-creditcard" : "openAddCreditCard",
		"click #button-add-paypal" : "openAddPaypal",
		"click .pm-delete" : "deletePaymentMethod",	
		"click .pm-update" : "updatePaymentMethod",					
	},
	bt_client_token: null,
	bt_environonment: null,
	bt_client: null,
	bt_paypal: null,
	initialize: function() {
		var that = this;
		$.post(acendaBaseUrl+'/api/braintree/token', function(data) {
			that.bt_client_token = data.result.client_token;
			that.bt_environment = data.result.environment;

			braintree.client.create({
			  authorization: that.bt_client_token 
			}).then(function (client) {
			    that.bt_client = client;


			  braintree.paypal.create({
			    client: that.bt_client
			  }, function (paypalErr, paypalInstance) {
			       if (paypalErr) {
			         console.error('Error creating PayPal:', paypalErr);
			          return;
			      }	
			      console.log('created paypal');
			      that.bt_paypal = paypalInstance;
		    	}, false);

				braintree.vaultManager.create({
					client: that.bt_client
				},function(err,vm) {
					vm.fetchPaymentMethods(function(err, payload) {
						console.log('paydirt',payload);


			            that.render();  
					});
				}); 
			});
		});
	},
	openAddCreditCard: function(e) {
		alert("Add Credit Card");

	},
	openAddPaypal: function(e) {
		var that = this;		

	      // Because tokenization opens a popup, this has to be called as a result of
	      // customer action, like clicking a button. You cannot call this at any time.
	      that.bt_paypal.tokenize({
	        flow: 'vault'
	        // For more tokenization options, see the full PayPal tokenization documentation
	        // http://braintree.github.io/braintree-web/current/PayPal.html#tokenize
	      }, function (tokenizeErr, payload) {
	        if (tokenizeErr) {
	          if (tokenizeErr.type !== 'CUSTOMER') {
	            console.error('Error tokenizing:', tokenizeErr);
	          }
	          return;
	        }

	        // Tokenization succeeded
	        console.log('Got a nonce! You should submit this to your server.');
	        console.log(payload.nonce);
	      });

	},
	updatePaymentMethod : function(e) {
		var elm = $(e.currentTarget);
        var token = elm.attr('id').split("-").pop(-1);	
        console.log(token);

	},
	deletePaymentMethod : function(e) {
		var elm = $(e.currentTarget);
        var token = elm.attr('id').split("-").pop(-1);	
        console.log(token);

	},
	render: function() {
	    return this;
	}
});



$(document).ready(function() {

	var pmv = new paymentMethodsView();
	pmv.render();
});