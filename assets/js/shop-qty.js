// Updates the subtotal and current item total.
var cartData = null;
function updateCartTotals(qtyField, cartItemId) {
	$.getJSON(acendaBaseUrl + '/api/sessioncart')
	.always(function(e) {
	})
	.done(function(data) {	
		var dataQty = 0.0;		
		if(typeof data.result.items[cartItemId] !== 'undefined') {
			dataQty = data.result.items[cartItemId].quantity;	
		}

		var v2Data = qtyField.parents('.item');
		var priceElement = v2Data.find('.cart-indiv .price .val').html();
		var priceElementTotal = v2Data.find('.cart-total .price .val').html();

		cartData = data.result;

		amount = parseFloat(priceElement * dataQty).toFixed(2);
		var savings = parseFloat( ( v2Data.find('.cart-indiv .price-compare .val').html() - priceElement ) * dataQty).toFixed(2);
		//
		if ($(v2Data).attr('data-sid')) {
			var dLID = $(v2Data).attr('data-sid');
		} else {
			var dLID = $(v2Data).attr('data-id');
		}
		var oldQty = v2Data.find('.cart-total .price .val').text() / priceElement;
		//console.log('oldQty: '+oldQty);
		var changeQty = parseInt(dataQty - oldQty);
		//console.log('changeQty: '+changeQty);
		var absChangeQty = Math.abs(changeQty);
		//
		//
		if (typeof dataLayer !== "undefined") {
			if (dataLayer !== null) {
				if (oldQty < dataQty) {
					//console.log('dataLayer add');
					dataLayer.push({
						'event': 'addToCart',
						'ecommerce': {
							'currencyCode': 'USD',
							'add': {                                // 'add' actionFieldObject measures.
								'products': [{                        //  adding a product to a shopping cart.
									'name': $(v2Data).find('h3').text(),
									'id': dLID,
									'price': priceElement,
									'brand': $(v2Data).find('.brand').text(),
									//'category': 'Apparel',
									//'variant': $(v2Data).attr('data-vid'),
									'quantity': absChangeQty
								}]
							}
						}
					});
					
				}
				if (oldQty > dataQty) {
					//console.log('dataLayer remove');
					dataLayer.push({
						'event': 'removeFromCart',
						'ecommerce': {
							'currencyCode': 'USD',
							'remove': {                                // 'add' actionFieldObject measures.
								'products': [{                        //  adding a product to a shopping cart.
									'name': $(v2Data).find('h3').text(),
									'id': dLID,
									'price': priceElement,
									'brand': $(v2Data).find('.brand').text(),
									//'category': 'Apparel',
									//'variant': $(v2Data).attr('data-vid'),
									'quantity': absChangeQty
								}]
							}
						}
					});
		
				}
			}
		}
		//
		//
		v2Data.find('.cart-total .price .val').text(amount);
		v2Data.find('.cart-total .percent .val').text(parseFloat(savings).toFixed(0));

		$('.estimate-subtotal .val').text(data.result.item_subtotal);
		$('.rate-estimate-checkout .val').text(data.result.shipping_rate);
		$('.estimate-coupons .val').text(data.result.discount_price);
		if (data.result.discount_price > 0 ) { $('.estimate-coupons').removeClass('d-none'); }
		$('.estimate-bundles .val').text(data.result.bundle_discount);
		if(typeof data.result.shipping_rate == 'undefined' ||  !data.result.shipping_rate  ) {
			data.result.shipping_rate = 0.00;
		}
		if(data.result.shipping_rate!='') {
			$('.rate-estimate-checkout').show();
		} else {
			$('.rate-estimate-checkout').hide();
		}
		if(data.result.tax_rate!=0 && data.result.shipping_rate!='') {
			$('.total-before-tax').show();
		} else {
			$('.total-before-tax').hide();		
		}
		if(data.result.tax_rate != 0) {
			$('.tax-estimate-checkout').show();			
		} else {

			$('.tax-estimate-checkout').hide();				
		}

		$('.total-before-tax .val').text((parseFloat(data.result.item_subtotal) + parseFloat(data.result.shipping_rate)).toFixed(2));
		$('.tax-estimate-checkout .val').text(data.result.tax_rate);
		$('.estimate-total .val').text(data.result.total);
	});
}

$('form#wishlist-form .modal_list_quantity, section#registry .modal_list_quantity').on('hidden.bs.modal', function () {
	document.location.reload();
})



// Adjusts the quantity of the +/- fields
function adjustQuantity(qtyField, increment, postForm) {
	console.log('aQ started')
	if (isNaN(qtyField.val())) {
		qtyField.val(0);
	}
	var limit = parseInt(qtyField.attr('max'));
	var previousValue = parseInt(qtyField.val());
	var id = qtyField.data('id');
	var model = qtyField.data('model');

	// Don't let quantity go below 0 if we're submitting to the server
	// After quickcart can fully access the API with customers authenticated through oauth we should be able to remove items dynamically under this condition
	if (typeof id !== 'undefined') {
		var compareValue = 1;
		if (qtyField.val() == 0 && !$("#wishlist").length && !$("#registry").length) { // Change 0 to 1, we shouldn't be submitting 0s to the server || Edit: Unless it's registry or wishlist
			qtyField.val(1);
			previousValue = 1;
		}
	} else {
		var compareValue = 0;
	}

	// Don't go below the compare value
	// edit: Unless you're on wishlist or registry
	if (!$("#wishlist").length && !$("#registry").length && previousValue <= compareValue && increment < 0) {
		return;
	}
	if(previousValue + increment <= 0 ){
		qtyField.val(0);
	} else {
		qtyField.val(previousValue += increment);
	}

	//Set qty to limit if entered value is above

	// Because of our situation with OAuth, we need to use the form to update wishlist and registry items; however, we can use the api to update sessioncart items.
	if (typeof id !== 'undefined') { // We need to submit the updated quantity to the server
		var form = qtyField.parents('form');
		var formData = form.serialize(); // We must serialize our form data here because disabled fields are not submitted

		// Dim quantity field while we update
		qtyField.parents('.quantity').find('input,button').prop('disabled',true);

		if (typeof model === 'undefined') { // No model defined, so submit the entire form
			$.ajax({
				type: form.attr('method'),
				url: form.attr('action'),
				data: formData + '&action=update'
			}).always(function(e) {
				qtyField.parents('.quantity').find('input,button').prop('disabled',false);
			});
		} else {
			qtyField.parents('.item').find('.error').hide();
			// Model is defined, so use the API to submit a put request
			$.ajax({
				type: 'put',
				url: acendaBaseUrl + '/api/' + model + '/' + id,
				dataType: 'json',
				data: JSON.stringify({ quantity: qtyField.val() })
			}).always(function(e) {
				qtyField.parents('.quantity').find('input,button').prop('disabled',false);
			}).fail(function(e) {
				console.log('errror')
				data = $.parseJSON(e.responseText);
				//console.log(data)
				qtyField.val(previousValue -= increment);
				if (data.code === 400 && model === 'cart/item') { // Bad request for the cart - not enough inventory
					if(typeof data.error != 'undefined') {
						var error = data.error[Object.keys(data.error)[0]][0];
						qtyField.parents('.item').find('.error').html(error);
					} else {
						qtyField.parents('.item').find('.error').html('Not enough inventory to add more items!');
					}
				} else { // Probably a connection failure
					qtyField.parents('.item').find('.error').html('Unknown error: could not update quantity.');
				}
				console.log('it reached here')
				if(limit){
				  if(!isNaN(limit)){
					if(previousValue > limit){
						console.log('was too big, qualified, set to limit: '+limit);
					  qtyField.val(limit);
					}
				  }
				}
				/*
				if (qtyField.val() > qtyField.attr('max')) {
					console.log('was too big, set to: '+qtyField.attr('max'));
					qtyField.val(qtyField.attr('max'));
				}
				*/
				qtyField.parents('.item').find('.error').show();
				if (model === 'cart/item') { // Check if we're at the cart, and if so, update the cart subtotal/individual item totals
					updateCartTotals(qtyField, id);
				}
			}).done(function(e) {
				if (model === 'cart/item') { // Check if we're at the cart, and if so, update the cart subtotal/individual item totals
					updateCartTotals(qtyField, id);
				}
			});
		}
	} else {
		console.log('detect prod page')
		if(qtyField.val() > limit) {
			console.log('detect prod page val too high, adjust')
			qtyField.val(limit);
		}
	}
            	
}


// +/- buttons on single page and collections
$('.btn-add').click(function(e) {
    console.log('ran 1')
	e.preventDefault();
	adjustQuantity($(this).parent().parent().find('.quantity-selector'), 1);
});
$('.btn-remove').click(function(e) {
    console.log('ran 2')
	e.preventDefault();
	adjustQuantity($(this).parent().parent().find('.quantity-selector'), -1);
});

$('.quantity-selector').on('focusin', function(){
    console.log("Saving value " + $(this).val());
    $(this).data('cur', $(this).val());
});
// Hitting the enter key on the add quantity fields
$('.quantity-selector').change(function(e) {
    console.log('ran 3')
	adjustQuantity($(this), 0); // Quantity was adjusted externally
});
$('.quantity-selector').keypress(function(e){
	// Run adjust quantity action when numbers are entered in field
	if (e.which == 13)
	{
	       console.log('ran 4')
		e.preventDefault();
		adjustQuantity($(this), 0); // Quantity was adjusted externally
	}
});

var sendDLFirst = 1;

$('.btn-remove-all').click(function(e) {
	if (sendDLFirst == 1) {
		e.preventDefault();
		//console.log('gotcha');
		//
		var v2Data = $(this).parents('.item');
		var curQty = $(v2Data).find('.quantity-selector').val();
		//
		if ($(v2Data).attr('data-sid')) {
			var dLID = $(v2Data).attr('data-sid');
		} else {
			var dLID = $(v2Data).attr('data-id');
		}
		//
		if (typeof dataLayer !== "undefined") {
			if (dataLayer !== null) {
				dataLayer.push({
					'event': 'removeFromCart',
					'ecommerce': {
						'currencyCode': 'USD',
						'remove': {
							'products': [{
								'name': $(v2Data).find('h3').text(),
								'id': dLID,
								'price': $(v2Data).find('.cart-indiv .price .val').text(),
								'brand': $(v2Data).find('.brand').text(),
								//'category': 'Apparel',
								//'variant': $(v2Data).attr('data-vid'),
								'quantity': curQty
							}]
						}
					}
				});
			}
		}
		//
		sendDLFirst = 0;
		$(this).click();
	} else {
		
	}
});

$(document).ready(function() {
   updateCartTotals($(''),0);
})

