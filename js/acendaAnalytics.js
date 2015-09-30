if(acenda.google_analytics_id){
	new AcendaAnalytics(acenda.google_analytics_id).init();
}

function AcendaAnalytics(trackingID){
	this.trackingID = trackingID;
	this.currency = 'USD';

	this.init = function(){
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	 	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	 	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	 	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		ga('create', this.trackingID , 'auto');  
		ga('require', 'displayfeatures'); 						// Enable demographics
		ga('send', 'pageview');

		if(true){ // if Enhanced Ecommerce
			this.ECroute(window.location.pathname);
		}else{
			this.route(window.location.pathname);
		}
		
	}

	this.route = function(route){
		if(route.includes('place')){
			this.transaction();
		}
	}

	this.ECroute = function(route){
		ga('require', 'ec');
		ga('set', '&cu', this.currency)
		this.addToCartTracking();

		if(route.includes('place')){
			this.ECtransaction();
		}
		if(route.includes('product')){
			this.productDetails();
		}
		if(route.includes('cart')){
			this.removeToCartTracking();
		}
	}

	this.removeToCartTracking = function(){
		var self = this;
		$('button[value*=remove\\/]').click(function(event) {
			event.stopPropagation();
			var button = $(event.currentTarget);
			var item_index = button.attr("value").replace('remove/','');
			var item_index = parseInt(item_index);
			if(Number.isInteger(item_index)){
				var variant = acenda.cart.items[item_index];
			}
			ga("ec:addProduct", {id: variant.id, name: variant.name, quantity: variant.quantity, price: variant.price, brand: variant.brand, currency: self.currency});
			ga("ec:setAction", "remove");
			ga("send", "event", "EnhancedEcommerce", "Removed Product", {nonInteraction: 1});
			button.off("click");
			button.trigger("click");
		});
	}

	this.addToCartTracking = function(){
		var self = this;
		$('button[value=cart]').click(function(event) {
    
    		var addedProducts = false;
		    event.preventDefault();
		    var cartButton = event.currentTarget;
		    var form = cartButton.parentElement;
		    while(form.nodeName != 'FORM'){
		        form = form.parentElement;
		    }
		    form = $(form);
		    form.find('.quantity-selector').each(function() {
		        if (!isNaN($(this).val())) {
		        	var qty = parseInt($(this).val());
		            var variant_id = $(this).attr("name").replace('items[','').replace(']','');
		            var variant = self.getVariant(variant_id);
		            if(variant && qty > 0){
		            	ga("ec:addProduct", {id: variant.id, name: variant.name, quantity: qty, price: variant.price, brand: variant.brand, currency: self.currency});
		            	addedProducts = true;
		            }
		        }
		    });
		    if(addedProducts){
		    	ga("ec:setAction", "add");
		    	ga("send", "event", "EnhancedEcommerce", "Added Product", {nonInteraction: 1});
		    }
		});
	}

	this.getVariant = function(variant_id){
		if(acenda.products){
			for(x in acenda.products){
				for(y in acenda.products[x].variants){
					if( variant_id == acenda.products[x].variants[y].id){
						acenda.products[x].variants[y].brand = acenda.products[x].brand;
						return acenda.products[x].variants[y];
					}
				}
			}
		}
		return null;
	}

	this.productDetails = function(){
		if(acenda.collection){
			ga('ec:addProduct', {
			  'id': acenda.collection.id,
			  'name': acenda.collection.name,
			  'brand': acenda.collection.brand,
			});
			ga('ec:setAction', 'detail');
			ga("send", "event", "EnhancedEcommerce", "Viewed Product", {nonInteraction: 1})
		}else{
			ga('ec:addProduct', {
			  'id': acenda.products[0].id,
			  'name': acenda.products[0].name,
			  'brand': acenda.products[0].brand,
			});
			ga('ec:setAction', 'detail');
			ga("send", "event", "EnhancedEcommerce", "Viewed Product", {nonInteraction: 1})
		}
	}

	//Add coupons used on the order
	this.ECtransaction = function(){
		if(acenda.order){
            if(acenda.order.items){
            	for(x in acenda.order.items){
            		ga('ec:addProduct', {               // Provide product details in an productFieldObject.
					  'id': acenda.order.id,                   // Product ID (string).
					  'name': acenda.order.items[x].name, // Product name (string).
					  'price': acenda.order.items[x].price,         // Product price (currency).
					  //'coupon': 'APPARELSALE',          // Product coupon (string).
					  'quantity': acenda.order.items[x].quantity   // Product quantity (number).
					});
            	}
            }
			ga('ec:setAction', 'purchase', {          // Transaction details are provided in an actionFieldObject.
			  'id': acenda.order.id,                  // (Required) Transaction id (string).
			  'affiliation': acenda.site, 			  // Affiliation (string).
			  'revenue': acenda.order.revenue,        // Revenue (currency).
			  'tax': acenda.order.tax,                // Tax (currency).
			  'shipping': acenda.order.shipping,      // Shipping (currency).
			  //'coupon': 'SUMMER2013'                // Transaction coupon (string).
			});
			ga("send", "event", "EnhancedEcommerce", "Completed Order", {nonInteraction: 1});
		}
	}

	this.transaction = function(){
		if(acenda.order){
			ga('require', 'ecommerce', 'ecommerce.js');			// Load the ecommerce plug-in.
			ga('ecommerce:addTransaction', {
	            'id': acenda.order.id,							// Transaction ID. Required
	            'affiliation': acenda.site,						// Affiliation or store name
	            'revenue': acenda.order.revenue,				// Grand Total
	            'shipping': acenda.order.shipping,				// Shipping
	            'tax': acenda.order.tax,						// Tax
	            'currency': this.currency						//local currency
            });
            if(acenda.order.items){
            	for(x in acenda.order.items){
            		ga('ecommerce:addItem', {
		                'id': acenda.order.id,						// Transaction ID. Required
		                'name': acenda.order.items[x].name,			// Product name. Required
		                'sku': acenda.order.items[x].sku,			// SKU/code
		                //'category': 'Green Medium',       		// Category or variation
		                'price': acenda.order.items[x].price,		// Unit price
		                'quantity': acenda.order.items[x].quantity,	// Quantity
		                'currency': this.currency					//local currency
	                });
            	}
            }
            ga('ecommerce:send');
		}
	}
}