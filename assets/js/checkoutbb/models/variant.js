var checkout = checkout || {};

(function () {
	'use strict';
	checkout.Variant = Backbone.Model.extend({
		urlRoot: acendaBaseUrl + '/api/variant',		
		parse: function(response) {
			return response.result;
		}
	})
})();