var checkout = checkout || {};

(function () {
	'use strict';
	checkout.BillingStates = Backbone.Collection.extend({
		url: acendaBaseUrl + '/api/region/states',
		parse: function(response) {
			return response.result;
		}
	})
})();