var checkout = checkout || {};

(function () {
	'use strict';
	checkout.Cart = Backbone.Model.extend({
		url: acendaBaseUrl + '/api/sessioncart',
		ready: false,
		products: [],
		variants: [],
		parse: function(response) {
			var that = this;
			var obj = response.result;
			var defer_variants = [];
			var defer_products = [];
			that.products = [];
			that.variants = [];			
			that.ready = false;
			// go and get the product and variant models for the items
			if(obj.items.length) {
				_.each(obj.items,function(v,k) {
					that.variants[k] = new checkout.Variant({id: v.product_id});
					defer_variants[k] = that.variants[k].fetch({success: function(response) {
					    that.products[k] = 	new checkout.Product({ id: response.get('product_id') });
					    defer_products[k] = that.products[k].fetch();
					}});
				})
			}
			// defer change event until we've gotten all products and variants
			$.when.apply($,$.merge(defer_products,defer_variants)).then(function() {
				that.ready = true;
				that.trigger('change', this);
			})
		    return obj;
		}
	})
})();