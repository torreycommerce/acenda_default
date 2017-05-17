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
	    
		    var fixSummaryHeight = function() {
		    	$('#checkout-right').height($('#checkout-left').height());
				console.log('updating height');
                $(document.body).trigger("sticky_kit:recalc");				
				setTimeout(fixSummaryHeight,1000);		    	
		    }
		    fixSummaryHeight();
			$('#summary-panel').stick_in_parent({recalc_every: 1});			    
		},
		render: function () {
		    console.log('rendering checkout');		
		}
	});
})(jQuery);