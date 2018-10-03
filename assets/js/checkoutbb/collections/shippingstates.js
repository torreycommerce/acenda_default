var checkout = checkout || {};

(function () {
	'use strict';
	checkout.ShippingStates = Backbone.Collection.extend({
		url: acendaBaseUrl + '/api/shippingmethod/states',
		parse: function(response) {
			return response.result;
		}
	})
})();