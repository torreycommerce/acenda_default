var checkout = checkout || {};

(function ($) {	
	'use strict';
	 checkout.SummaryView = Backbone.View.extend({
		el: '.checkoutapp #summary-panel',
		events: {
			'click button#checkout_enter_coupon' : 'clickEnterCoupon',
			'click button.remove-coupon' : 'clickRemoveCoupon'			

		},
		initialize: function () {
			var fixSummaryHeight = function() {
				var keepFocus = false;
				if($('input#cart_coupon_code').is(':focus')) {
					keepFocus=true;
				}
				if($('#checkout-left').height() > $('#summary-panel').height()) {
				    //$('#checkout-right').height($('#checkout-left').height());
					} else {
				        //$('#checkout-right').height($('#summary-panel').height());		
					}
				setTimeout(fixSummaryHeight,1000);		    	
			}
			fixSummaryHeight();
		    //this.$el.stick_in_parent({recalc_every: 1});		    
		},
		render: function () {

			if(typeof co.cart !== 'object'  || typeof co.cart.get('items') === 'undefined') return;
			var that = this;	
			//var itemTemplate = _.template($('#summary-item-template').html());
			//var totalsTemplate = _.template($('#summary-totals-template').html());
			//
			var itemCompTemplate = _.template($('#summary-item-compress').html());
			var totalsCompTemplate = _.template($('#summary-totals-compress').html());
			//
		    this.$el.find('#num-items').html(co.cart.get('items').length);
		    

			that.$el.find('#item-list-data').html('');

		    if(co.cart.get('items').length && co.cart.products.length) {
		    	_.each(co.cart.get('items'),function(v,k){
		    		that.$el.find('#item-list-data').append(itemCompTemplate({
						item:v,
						availability: ((typeof co.cart.variants[k] != 'undefined' && co.cart.variants[k].has_stock)?"In Stock":"Out of Stock"),
						product: co.cart.products[k], 
						variant: co.cart.variants[k]
					}));
	    		});
	    		/*_.each(co.cart.get('items'),function(v,k){
					that.$el.find('#item-list').append(itemTemplate({
						item:v,
						availability: ((co.cart.variants[k].has_stock)?"In Stock":"Out of Stock"),
						product: co.cart.products[k], 
						variant: co.cart.variants[k]
					}));
	    		});*/
	    		var cart = co.cart.toJSON();
	    		if(!co.cart.get('shipping_rate')) co.cart.set('shipping_rate',0.00);
	    		if(!co.cart.get('tax_rate')) co.cart.set('tax_rate',0.00);	    		
	    	    co.cart.set('total',parseFloat(cart.subtotal) + parseFloat(cart.shipping_rate)+ ((checkout_product_prices_include_tax)?0:parseFloat(cart.tax_rate)) );

				/*
				that.$el.find('#totals-section').html('').append(totalsTemplate({
					cart: co.cart.toJSON(),
					steps: co.checkout_steps
				}));
				*/
				
				that.$el.find('#totals-section-data').html('').append(totalsCompTemplate({
					cart: co.cart.toJSON(),
					steps: co.checkout_steps
				}));
				//
				var totalsHtml = $('#totals-section-copy').clone();
				var sauce = $('#totals-section-data');

				$(totalsHtml).find('.totals-subtotal .val').text($(sauce).find('.c-ist').text());
				if ($(sauce).find('.discount').length) {
					$(totalsHtml).prepend($(sauce).find('.discounts').html());
				}
				if ($(sauce).find('.c-sr').length) {
					$(totalsHtml).find('.totals-shipping .val').text($(sauce).find('.c-sr').text());
				} else {
					$(totalsHtml).find('.totals-shipping').remove();
				}
				if ($(sauce).find('.c-dp').length) {
					$(totalsHtml).find('.totals-discount .val').text($(sauce).find('.c-dp').text());
				} else {
					//console.log('remove Disc')
					$(totalsHtml).find('.totals-discount').remove();
				}
				if ($(sauce).find('.c-tr').length) {
					$(totalsHtml).find('.totals-tax .val').text($(sauce).find('.c-tr').text());
				} else {
					$(totalsHtml).find('.totals-tax').remove();
				}
				$(totalsHtml).find('.totals-total .val').text($(sauce).find('.c-t').text());
				$('#totals-section').html($(totalsHtml).html());
		    }
			that.$el.find('#item-list').html('');		    
		    $('#item-list-data .compressed-item').each(function() {
				var listItem = $('#item-list-copy .item').clone();
				$(listItem).find('.media-object').attr('src',($(this).find('.t').text()));
				$(listItem).find('.product-name').text($(this).find('.n').text());
				if ($(this).find('.s').text() == "In Stock") {
				    $(listItem).find('.stock').html('<div class="text-success">'+$(this).find('.s').text()+'</div>');
				} else {
				    $(listItem).find('.stock').html('<div class="text-danger">'+$(this).find('.s').text()+'</div>');
				}
				$(listItem).find('.qty').text($(this).find('.q').text());
				$(listItem).find('.price .val').text($(this).find('.p').text());
				var temp = $(listItem).find('.price .val').text();
				temp = Number(temp).toFixed(2).toString();
				$(listItem).find('.price .val').html(temp);
				$(listItem).find('.media-body').append($(this).find('.l').text());
				$('#item-list').append(listItem);
			});
		},
		clickRemoveCoupon: function(e) {
			e.preventDefault();
			console.log(e);
            var remId = $(e.currentTarget).attr('id').split('-')[2];
            $.post(acendaBaseUrl + '/cart/ajax.json', {cart: { action: 'removecoupon/' + remId}},function(data) {
              	co.fetchCart();
            });
		},
		clickEnterCoupon : function(e) {

			e.preventDefault();
	        var coupon_code = $('input#cart_coupon_code').val();
	        $('#enter_coupon_validation').html('');
	        
	        if(coupon_code) {
                 $('button#checkout_enter_coupon').prop('disabled',true); 	        	
	            $(this).prop('disabled',true);
	            $.post(acendaBaseUrl + '/cart/ajax.json', $('form[name=coupon]').serialize()).done(function(data) {   
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