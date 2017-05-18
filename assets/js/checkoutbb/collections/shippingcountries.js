var checkout = checkout || {};

(function () {
	'use strict';
	checkout.ShippingCountries = Backbone.Collection.extend({
		url: acendaBaseUrl + '/api/shippingmethod/country',
		parse: function(response) {
			return response.result;
		}
	})
})();