
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
	template: _.template($('#payment-methods-tmpl').html()),
	events: {
		"click .icon":          "open",
		"click .button.edit":   "openEditDialog",
		"click .button.delete": "destroy"
	},
	bt_client_token: null,
	bt_environonment: null,
	bt_client: null,
	initialize: function() {
		var that = this;
		$.post(acendaBaseUrl+'/api/braintree/token', function(data) {
			that.bt_client_token = data.result.client_token;
			that.bt_environment = data.result.environment;

			braintree.client.create({
			  authorization: that.bt_client_token 
			}).then(function (client) {
			    that.bt_client = client;


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
	render: function() {
		// var methods = new paymentMethodCollection();	
		// methods.fetch();
	 //    var html = this.template(methods.toJson());
	 //    this.$el.html(html);
	    return this;
	}
});



$(document).ready(function() {

	var pmv = new paymentMethodsView();
	pmv.render();
});