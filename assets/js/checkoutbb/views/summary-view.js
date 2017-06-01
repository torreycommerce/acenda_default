var checkout = checkout || {};

(function ($) {	
	'use strict';
	 checkout.SummaryView = Backbone.View.extend({
		el: '.checkoutapp #summary-panel',
		events: {
			'click button#checkout_enter_coupon' : 'clickEnterCoupon'

		},
		initialize: function () {
			var fixSummaryHeight = function() {
				var keepFocus = false;
				if($('input#cart_coupon_code').is(':focus')) {
					console.log('keeping focus');
					keepFocus=true;
				}
				if($('#checkout-left').height() > $('#summary-panel').height()) {
				    $('#checkout-right').height($('#checkout-left').height());
					} else {
				        $('#checkout-right').height($('#summary-panel').height());		
					}
			    //$(document.body).trigger("sticky_kit:recalc");	
			    // if(keepFocus) {
			    // 	setTimeout(function() {$('input#cart_coupon_code').focus()},200);
			    // }
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
	    		var cart = co.cart.toJSON();
	    		console.log(cart);
	    		if(!co.cart.get('shipping_rate')) co.cart.set('shipping_rate',0.00);
	    		if(!co.cart.get('tax_rate')) co.cart.set('tax_rate',0.00);	    		
	    	    co.cart.set('total',parseFloat(cart.subtotal) + parseFloat(cart.shipping_rate)+ parseFloat(cart.tax_rate));

				that.$el.find('#totals-section').html('').append(totalsTemplate({
					cart: co.cart.toJSON(),
					steps: co.checkout_steps
				}));

		    }
		},
		clickEnterCoupon : function(e) {

			e.preventDefault();
	        var coupon_code = $('input#cart_coupon_code').val();
	        $('#enter_coupon_validation').html('');
	        
	        if(coupon_code) {
                 $('button#checkout_enter_coupon').prop('disabled',true); 	        	
	            $(this).prop('disabled',true);
	            $.post(acendaBaseUrl + '/cart/ajax.json', $('form[name=coupon]').serialize()).done(function(data) {
	                console.log(data.errors);       
                    if(data.errors) {
                        $('#enter_coupon_validation').html('<small>'+data.errors+'</small>');   
                    }   
                    else {
                    	co.fetchCart();
                    }              
	            }).always(function() {
	                $('button#checkout_enter_coupon').prop('disabled',false); 
	            });

	        }
		}
	});
})(jQuery);