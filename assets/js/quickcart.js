console.log('qc v52');

var qcrecalc = 1;
var qcwearego = 0;

// boots v4
$('body').on('mouseenter focusin','#header .cart',function(e){
    //console.log('e event only IN');
    if (qcwearego != 1) {
        if (!$('#qc-parent').hasClass('show')) {
            qcwearego = 1;
            $('#qc-btn').dropdown('toggle');
        }
    } else {
        //console.log('e event has already happened, no dupe');
    }
});

$('body').on('mouseleave focusout','#header .cart',function(e){
    qcwearego = 0;
});


$('#qc-parent').on('show.bs.dropdown', function () {
    if (qcrecalc == 1) {
        //console.log('bs show, now try qc fetch');
        ajaxCart("{}", true);
    } else {
        if ($('.quickcart .item-count') > 0) {
            displayCart();
        }
    }
});

/*$('#qc-parent').on('shown.bs.dropdown', function () {
    console.log('bs shown, do nothing');
});*/

$('#qc-parent').on('hidden.bs.dropdown', function () {
    //console.log('qc hidden, but not remove ready');
    //$('#qc-parent').removeClass('qc-ready');
    resetErrors();
});







$(function() {
    $.getJSON(acendaBaseUrl + '/api/sessioncart', function(data) {
        $('#header .item-count').html(data.result.item_count).addClass('ready');
    });
});

var pData;
var vData = $('#product-details .active');

$('button[value=cart]').click(function(event) {
    qcrecalc = 1;
    event.preventDefault();
    if ($('#singleProduct').length) {
        pData = $('#product-intro');
        vData = $('#product-details .active');
    } else {
        pData = $(this).parents('.piece');
        vData = $(this).parents('.piece').find('.active');
    }
    var cartButton = event.currentTarget;
    var form = cartButton.parentElement;
    while(form.nodeName != 'FORM'){
        form = form.parentElement;
    }
    form = $(form);
    var sum = 0;
    form.find(".quantity-selector").each(function() {
        if (!isNaN($(this).val())) {
            sum += parseInt($(this).val());
        }
    });
    if (sum === 0) {
        alert('Need to enter a quantity!');
        return false;
    }

    // Disable submit button
    $('button[value=cart]').addClass('wait').attr('disabled',true);
    //console.log("Add to cart");
    //console.log(form.serialize());
    
    $.post(acendaBaseUrl + '/product/route',
        form.serialize())
    .always(function(data) {
        // Make sure to reenable it, success or failure
        $('button[value=cart]').each(function() {
            $(this).removeClass('wait');
            // only enable the cart button if it wasn't disabled due to lack of Stock/Price
            if (!$(this).parents('.piece').find('.quantity-selector').attr('disabled')) {
                $(this).attr('disabled',false);
            }
        });
        $("html, body").animate({ scrollTop: 0 }, 600);
        $('#qc-btn').focus();
    })
    .fail(function() {
        // Set popover on failure to add items
        $('.quickcart .error').html('<p>Failed to add item(s) to cart.</p>');
    })
    //.done(ajaxCart);
});

function ajaxCart(data, r) {
    console.log('f ajaxCart()');
    //console.log('dataLayer add');
    //
    if ($(vData).find('.sku').length) {
        var dLID = $(vData).find('.sku span').text();
    } else {
        var dLID = $('#product-details .variations').attr('data-id');
    }
    if (typeof dataLayer !== "undefined") {
        if (dataLayer !== null) {
            dataLayer.push({
                'event': 'addToCart',
                'ecommerce': {
                    'currencyCode': 'USD',
                    'add': {                                // 'add' actionFieldObject measures.
                        'products': [{                        //  adding a product to a shopping cart.
                            'name': $(pData).find('.product-name').text(),
                            'id': dLID,
                            'price': $(vData).find('.price .val').text(),
                            'brand': $(pData).find('.brand').text(),
                            //'category': 'Apparel',
                            //'variant': $(vData).attr('data-vid'),
                            'quantity': $('.quantity-selector').val()
                        }]
                    }
                }
            });
        }
    }
    // BEGIN CONFIG VARIABLES
    var show_all = true; // Whether to show all products in ajax cart
    // END CONFIG VARIABLES

    var cart_items, cart_item_count = 0, cart_subtotal = 0; // Cart attributes

    // Check for items
    var result = $.parseJSON(data);

    $.ajax({
        dataType: "json",
        url: acendaBaseUrl + '/api/sessioncart'
    })
    .done(function(data) {
        // Update cart count and create popover
        cart_items = data.result.items;
        cart_item_count = data.result.item_count;
        cart_subtotal = data.result.subtotal;
    })
    .then(function(data) {
        var requests = []; // Deferred request array
        var response = []; // Deferred request response array
        var first_product_added = false; // Whether it's the first product to be added to cart (determines whether to clone)
        var product_attr = []; // Product attribute array
        var items = []; // Items array
        var product_cart_id = []; // product_id -> cart_id array

        if (show_all) {
            items = cart_items;
        } else {
            console.log('attempt not show_all');
            items = $('.productForm').serializeArray(); // Items that were added
        }
        
        if(items.length == 0) {
            Object.keys(result).forEach(function(id) {
                items.push({product_id:id, quantity:1});
            });
        }

        $('.ajaxcart-product:gt(0)').remove(); // Remove all but first ajaxcart-product (in case of multiple adds)


        for (var i = 0; i < items.length; i++) {
            product_cart_id[items[i].product_id] = i;
            // Go through and get the id, thumbnail and quantity
            var product, product_quantity, product_id;
            if (show_all) {
                product = items[i];
                product_quantity = product.quantity;
                product_id = product.product_id;
            } else {
                product = items[i];
                product_quantity = product.value;
                if (product_quantity == '') {
                    product_quantity = 1;
                }
                if (product_quantity == 0) {
                    continue;
                }
                product_id = product.name.match(/\[(.*?)\]/)[1];
            }
            product_attr[product_id] = {quantity:product_quantity};
            // Generate a request for product data
            var request = $.getJSON(acendaBaseUrl + '/api/variant/' + product_id)
            .done(function(data) {
                response.push(data.result);
            });
            requests.push(request); // Push request onto array
        }
        var defer = $.when.apply($, requests); // Run all requests
        defer.done(function() {

            // Sort the responses by most recently added to the cart (by cart item ID)
            response.sort(function(a, b) {
                return product_cart_id[a.id] > product_cart_id[b.id];
            });
            for (var i = 0; i < response.length; i++) {
                var product_name = response[i].name;
                var product_price = parseFloat(response[i].price).toFixed(2);
                var product_thumbnail = response[i].thumbnail;
                var product_id = response[i].id;

                if (!first_product_added) {
                    $('.ajaxcart-product .product-image').attr('src', product_thumbnail);
                    $('.ajaxcart-product .product-name').html(product_name);
                    $('.ajaxcart-product .price .val').html(product_price);
                    $('.ajaxcart-product .product-quantity').html(product_attr[product_id].quantity);
                    first_product_added = true;
                } else {
                    var cloned = $('.ajaxcart-product:last').clone().appendTo('.ajaxcart-products');
                    cloned.find('.product-image').attr('src', product_thumbnail);
                    cloned.find('.product-name').html(product_name);
                    cloned.find('.price .val').html(product_price);
                    cloned.find('.product-quantity').html(product_attr[product_id].quantity);
                }

                //Error management
                resetErrors();
    
                Object.keys(result).forEach(function(id) {
                    if(result[id] == false || typeof result[id]['error'] != 'undefined') {
                        var message = "<b><u>Item Not Added.</u></b>" + '</br>';
                        if(typeof result[id]['error'] != 'undefined') {
                            message += result[id]['error'][Object.keys(result[id]['error'])[0]][0];
                        }
                        var error = $('<div>', {"class": "alert alert-danger mt-3"}).html(message);
                        errors.append(error);
                    }
                });

            }
            $('#header .item-count').html(cart_item_count).addClass('ready');
            $('.ajaxcart .subtotal .val').html(cart_subtotal);

            if (show_all) {
                $('.ajaxcart .heading').html('');
            } else
                $('.ajaxcart .heading').html('The following item(s) were added to your cart:');

            $('#collection .quantity-selector').val(0); // Set collection quantity selector values to 0

            if(cart_items.length > 0) {
                displayCart();
            }
            console.log('set qcrecalc to 0');
            qcrecalc = 0;
        });
    });
}

function displayCart(){
    console.log('f displayCart(), add qc-ready');
    setTimeout(function() {
        $('#qc-parent').addClass('qc-ready');
    }, 50);
}

function resetErrors(){
    $('.ajaxcart .error').empty();
}
