var checkout = checkout || {};

(function () {
	'use strict';
	checkout.BillingCountries = Backbone.Collection.extend({
		url: acendaBaseUrl + '/api/payment/country',
		parse: function(response) {
			return response.result;
		}
	})
})();