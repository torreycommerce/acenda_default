var checkout = checkout || {};

(function ($) {	
	'use strict';
	 checkout.SummaryView = Backbone.View.extend({
		el: '.checkoutapp #summary-panel',
		events: {

		},
		initialize: function () {
			var fixSummaryHeight = function() {
				if($('#checkout-left').height() > $('#summary-panel').height()) {
				    $('#checkout-right').height($('#checkout-left').height());
					} else {
				        $('#checkout-right').height($('#summary-panel').height());		
					}
			    $(document.body).trigger("sticky_kit:recalc");				
				setTimeout(fixSummaryHeight,1000);		    	
			}
			fixSummaryHeight();
		    this.$el.stick_in_parent({recalc_every: 1});		    
		},
		render: function () {

			if(typeof co.cart !== 'object'  || typeof co.cart.get('items') === 'undefined') return;
			var that = this;	
			var itemTemplate = _.template($('#summary-item-template').html());
			var totalsTemplate = _.template($('#summary-totals-template').html());			
		    this.$el.find('#num-items').html(co.cart.get('items').length);
			that.$el.find('#item-list').html('');
		    if(co.cart.get('items').length) {
	    		_.each(co.cart.get('items'),function(v,k){
					that.$el.find('#item-list').append(itemTemplate({
						item:v,
						availability: ((co.cart.variants[k].has_stock)?"In Stock":"Out of Stock"),
						product: co.cart.products[k], 
						variant: co.cart.variants[k]
					}));
	    		});

				that.$el.find('#item-list').append(totalsTemplate({
					cart: co.cart.toJSON(),
					steps: co.checkout_steps
				}));

		    }
		}
	});
})(jQuery);