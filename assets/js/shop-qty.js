// Updates the subtotal and current item total.
function updateCartTotals(qtyField, cartItemId) {
	$.getJSON(acendaBaseUrl + '/api/sessioncart')
	.always(function(e) {
		//
	})
	.done(function(data) {
		var dataRST = data.result.subtotal;
		var dataQty = data.result.items[cartItemId].quantity;
		var itemElement = qtyField.parents('.item');
		var priceElement = itemElement.find('.cart-indiv .price .val').html();

		amount = parseFloat(priceElement * dataQty).toFixed(2);
		var savings = parseFloat( ( itemElement.find('.cart-indiv .price-regular .val').html() - itemElement.find('.cart-indiv .price .val').html() ) * dataQty).toFixed(2);

		itemElement.find('.cart-total .price .val').html(amount);
		itemElement.find('.cart-total .percent .val').html(savings);

		$('#estimate-subtotal .val').html(dataRST);
		//
		var rateEC = $('#rate-estimate-checkout .val').text();
		var taxEC = $('#tax-estimate-checkout .val').text();
		var totalBT = $('#total-before-tax .val').text();
		var ifTotalBT = parseFloat(parseFloat(dataRST) + parseFloat(rateEC)).toFixed(2);
		var newEstimateTotal = 0;
		//
		if ($('#total-before-tax .val').html() > 0 ) {
		    $('#total-before-tax .val').html(ifTotalBT);
			newEstimateTotal = parseFloat(parseFloat(taxEC) + parseFloat(ifTotalBT)).toFixed(2);
		} else {
            newEstimateTotal = parseFloat(dataRST).toFixed(2);
		}
		//
		$('#estimate-total .val').html(newEstimateTotal);
	});
}

$('div#wishlist .modal_list_quantity, div#registry .modal_list_quantity').on('hidden.bs.modal', function () {
	document.location.reload();
})



// Adjusts the quantity of the +/- fields
function adjustQuantity(qtyField, increment, postForm) {
	if (isNaN(qtyField.val())) {
		qtyField.val(0);
	}
	var limit = parseInt(qtyField.data('limit'));
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
	if(limit){
	  if(!isNaN(limit)){
		if(previousValue > limit){
		  qtyField.val(limit);
		}
	  }
	}

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
				data = $.parseJSON(e.responseText);
				qtyField.val(previousValue -= increment);
				if (data.code === 400 && model === 'cart/item') { // Bad request for the cart - not enough inventory
					qtyField.parents('.item').find('.error').html('Not enough inventory to add more items!');
				} else { // Probably a connection failure
					qtyField.parents('.item').find('.error').html('Unknown error: could not update quantity.');
				}
				qtyField.parents('.item').find('.error').show();
			}).done(function(e) {
				if (model === 'cart/item') { // Check if we're at the cart, and if so, update the cart subtotal/individual item totals
					updateCartTotals(qtyField, id);
				}
			});
		}
	}
}


// +/- buttons on single page and collections
$('.btn-add').click(function(e) {
	e.preventDefault();
	adjustQuantity($(this).parent().parent().find('.quantity-selector'), 1);
});
$('.btn-remove').click(function(e) {
	e.preventDefault();
	adjustQuantity($(this).parent().parent().find('.quantity-selector'), -1);
});
// Hitting the enter key on the add quantity fields
$('.quantity-selector').change(function(e) {
	adjustQuantity($(this), 0); // Quantity was adjusted externally
});
$('.quantity-selector').keypress(function(e){
	// Run adjust quantity action when numbers are entered in field
	if (e.which == 13)
	{
		e.preventDefault();
		adjustQuantity($(this), 0); // Quantity was adjusted externally
	}
});