var checkout = checkout || {};

(function () {
	'use strict';
	checkout.Product = Backbone.Model.extend({
		urlRoot: acendaBaseUrl + '/api/product',
		parse: function(response) {
			return response.result;
		}
	})
})();