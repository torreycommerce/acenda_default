var checkout = checkout || {};

(function () {
	'use strict';
	checkout.Registry = Backbone.Model.extend({
		urlRoot: acendaBaseUrl + '/api/registry',		
		parse: function(response) {
			return response.result;
		}
	})
})();