var checkout = checkout || {};

(function () {
	'use strict';
	checkout.Customer = Backbone.Model.extend({
		urlRoot: acendaBaseUrl + '/api/customer',
		parse: function(response) {
			console.log(response);
			return response.result[0];
		}
	})
})();