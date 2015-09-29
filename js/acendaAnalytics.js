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
			ga('require', 'ec');
			ga('set', '&cu', this.currency)
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
		if(route.includes('place')){
			this.ECtransaction();
		}
		if(route.includes('product')){
			this.productDetails();
		}
	}

	this.productDetails = function(){
		if(acenda.products.length == 1){
			ga('ec:addProduct', {
			  'id': acenda.products[0].id,
			  'name': acenda.products[0].name,
			  'brand': acenda.products[0].brand,
			});
			ga('ec:setAction', 'detail');
			ga("send", "event", "EnhancedEcommerce", "Viewed Product", {nonInteraction: 1})
		}
	}

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