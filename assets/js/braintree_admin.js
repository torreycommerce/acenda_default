
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
		"click .button.delete": "deletePaymentMethod",
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
				      that.bt_paypal = paypalInstance;
			    });

					braintree.vaultManager.create({
						client: that.bt_client
					},function(err,vm) {
						vm.fetchPaymentMethods(function(err, payload) {
				            that.render();  
						});
					}); 
				});
		});
	},
	openAddCreditCard: function(e) {
		var that = this;
        var form = document.querySelector('#create-card-form');
        var submit = document.querySelector('#card-submit-btn');      
		var elm = $(e.currentTarget);	        

	      braintree.client.create({
	        authorization: that.bt_client_token 
	      }, function (clientErr, clientInstance) {
	        if (clientErr) {
	          console.error(clientErr);
	          return;
	        }

	        // This example shows Hosted Fields, but you can also use this
	        // client instance to create additional components here, such as
	        // PayPal or Data Collector.

	        braintree.hostedFields.create({
	          client: clientInstance,
			    styles: {
			      'input': {
			      	'height': '15px',
			        'font-size': '14px',
			        'font-family': 'helvetica, tahoma, calibri, sans-serif',
			        'color': '#3a3a3a'
			      },
			      ':focus': {
			        'color': 'black'
			      }
			    },
	          fields: {
	            number: {
	              selector: '#card-number',
	              placeholder: '4111 1111 1111 1111',
                  rejectUnsupportedCards: true	              
	            },
	            cvv: {
	              selector: '#cvv',
	              placeholder: '•••'
	            },
	            expirationDate: {
	              selector: '#expiration-date',
	              placeholder: '10/2019'
	            }
	          }
	        }, function (hostedFieldsErr, hostedFieldsInstance) {
	           $('div#payment-methods').fadeOut('fast',function() {
	           	   $('div#payment-platforms').hide();
 	               $('div#hosted-fields-form').show();
 	           });
	          if (hostedFieldsErr) {
	            console.error(hostedFieldsErr);
	            return;
	          }

	          $('#card-submit-btn').prop('disabled',false);
	          form.addEventListener('reset', function (event) {
	              event.preventDefault();	 
				  location.reload();	                        		               
			      hostedFieldsInstance.teardown();
	          });
	          form.addEventListener('submit', function (event) {
	            var originalText  =  $('#card-submit-btn').html();
	            event.preventDefault();	            
			    $('#card-submit-btn').html('<i class="fas fa-cog fa-spin"> </i>')		            
	            $('#card-submit-btn').prop('disabled',true);	   
	            $('div#card-error').html('');      	
	            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
	                 $('input#card-submit-btn').prop('disabled',true);              
		            if (tokenizeErr) {
		            	var errorTxt = '';
		              	$('#card-submit-btn').html(originalText);

		              	switch(tokenizeErr.code) {
		              		case 'HOSTED_FIELDS_FIELDS_EMPTY':
		              			errorTxt = 'Please fill out all of the above fields.'
		              		break;
		              		case 'HOSTED_FIELDS_FIELDS_INVALID':
		              			if(tokenizeErr.details.invalidFieldKeys.indexOf('number')!==-1) {
		              				errorTxt = 'Please enter a valid card number';
		              			} 
		              			else if(tokenizeErr.details.invalidFieldKeys.indexOf('expirationDate')!==-1) {

		  		              		errorTxt = 'Please enter a valid expiration date.';            				
		              			} 
		              			else if(tokenizeErr.details.invalidFieldKeys.indexOf('cvv')!==-1) {
		              				errorTxt = 'Please enter a valid CVV code.';
		              			}
 								else {
		              				errorTxt = "One of the above fields is invalid."
		              			} 
		              		break;
		              		default:
		              			errorTxt = 'An unknown error has occured.';
		              		break;
		              	}
	                    $('input#card-submit-btn').prop('disabled',false);
		                $('div#card-error').html('<div class="alert alert-danger">' +  errorTxt  +' </div>');
		                return;
		            }
 	                 $('div#hosted-fields-form').slideUp();	  		            
				    // More detailed example of handling API errors: https://codepen.io/braintree/pen/MbwjdM
				    $.get(acendaBaseUrl + '/account/payment-methods/create/' + payload.nonce,function(data) { 
				        location.reload();				   
				    }); 		    
	            });
	          }, false);
	        });
	      });


	},
	openAddPaypal: function(e) {
		var that = this;
		var elm = $(e.currentTarget);		
	        elm.prop('disabled',true);
	      // Because tokenization opens a popup, this has to be called as a result of
	      // customer action, like clicking a button. You cannot call this at any time.
	      that.bt_paypal.tokenize({
	        flow: 'vault'
	        // For more tokenization options, see the full PayPal tokenization documentation
	        // http://braintree.github.io/braintree-web/current/PayPal.html#tokenize
	      }, function (tokenizeErr, payload) {
	            elm.prop('disabled',false);	   	      	
	        if (tokenizeErr) {
	          if (tokenizeErr.type !== 'CUSTOMER') {
	            console.error('Error tokenizing:', tokenizeErr);
	            alert('There was a problem with paypal');
	            elm.prop('disabled',false);	            
	          }
	          return;
	        }
	        // Tokenization succeeded
            elm.html('<i class="fas fa-cog fa-spin"> </i>')	        
	        location.reload();
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
	render: function() {
	    return this;
	}
});



$(document).ready(function() {

	var pmv = new paymentMethodsView();
	pmv.render();
});