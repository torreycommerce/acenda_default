var checkout = checkout || {};

(function () {
	'use strict';
	checkout.Wishlist = Backbone.Model.extend({
		urlRoot: acendaBaseUrl + '/api/wishlist',		
		parse: function(response) {
			return response.result;
		}
	})
})();