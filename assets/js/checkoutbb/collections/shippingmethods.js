var checkout = checkout || {};

(function () {
	'use strict';
	checkout.ShippingMethods = Backbone.Collection.extend({
		url: acendaBaseUrl + '/api/shippingmethod/byregion',
		parse: function(response) {
			return response.result;
		}
	})
})();