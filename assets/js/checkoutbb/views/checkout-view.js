var checkout = checkout || {};

(function ($) {
	'use strict';
	checkout.CheckoutView = Backbone.View.extend({
		el: '.checkoutapp',
		summaryTemplate: _.template($('#summary-template').html()),
		events: {

		},
		initialize: function () {
		    console.log('initializing checkout');
		},
		render: function () {
		    console.log('rendering checkout');		
		}
	});
})(jQuery);