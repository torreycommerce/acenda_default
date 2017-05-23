var checkout = checkout || {};

(function () {
	'use strict';
	checkout.CustomerAddresses = Backbone.Collection.extend({
		url: acendaBaseUrl + '/api/customeraddress',
		parse: function(response) {
			return response.result;
		}
	})
})();