
var cartCloseTimeout;
var cartTriggerTimeout;

$(function() {

    var q=false;

    $("li.cart").hover(function(){
        q = true;
        if (!$(".popover.fade.bottom.in").length && !cartTriggerTimeout) {
            cartTriggerTimeout = setTimeout(function(){
                if (q) {
                    if($('.quickcart').attr('data-content') == '') {
                        ajaxCart("{}", true);
                    } else {
                        $('.quickcart').popover("show");
                        cartCloseTimeout = setTimeout(function(){$('.quickcart').popover("hide"); resetErrors();}, 5000);
                    }
                }
                cartTriggerTimeout = false;
            }, 500);
        }

    }, function(){q = false;});


    $.getJSON(acendaBaseUrl + '/api/sessioncart', function(data) {
        $('.quickcart .item-count').html(data.result.item_count);
    });
    $('.quickcart').popover({html:true, trigger: 'manual', placement:'bottom'});
});

$('html').on("click", "#ajaxcart-close", function() {
    $('.quickcart').popover('hide');
});

$('button[value=cart]').click(function(event) {
    event.preventDefault();
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
    })
    .fail(function() {
        // Set popover on failure to add items
        $('.quickcart').attr('data-content','<h5>Failed to add item(s) to cart.</h5>').popover('show');
    })
    .success(ajaxCart);
});

function ajaxCart(data, r) {

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
            items = $('.productForm').serializeArray(); // Items that were added
        }

        $('.quickcart .ajaxcart-product:gt(0)').remove(); // Remove all but first ajaxcart-product (in case of multiple adds)


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
                    var cloned = $('.ajaxcart-product:last').clone().appendTo('.quickcart .ajaxcart-products');
                    cloned.find('.product-image').attr('src', product_thumbnail);
                    cloned.find('.product-name').html(product_name);
                    cloned.find('.price .val').html(product_price);
                    cloned.find('.product-quantity').html(product_attr[product_id].quantity);
                }
            }

            //Error management
            var errors = $('.ajaxcart .error');
            errors.empty();

            Object.keys(result).forEach(function(id) {
                if(result[id] == false || typeof result[id]['error'] != 'undefined') {
                    var message = "<b><u>Item Not Added.</u></b>" + '</br>';
                    if(typeof result[id]['error'] != 'undefined') {
                        message += result[id]['error'][Object.keys(result[id]['error'])[0]][0];
                    }
                    var error = $('<div>', {"class": "alert alert-danger mar-t"}).html(message);
                    errors.append(error);
                }
            });

            $('#header .item-count').html(cart_item_count);
            //$('.quickcart .ajaxcart .item-count').html(cart_item_count);
            $('.quickcart .ajaxcart .subtotal .val').html(cart_subtotal);

            if (show_all) {
                $('.quickcart .ajaxcart .heading').html('');
            } else
                $('.quickcart .ajaxcart .heading').html('The following item(s) were added to your cart:');

            $('#collection .quantity-selector').val(0); // Set collection quantity selector values to 0


            if(cart_items.length > 0) {
                displayCart($('.quickcart').attr('data-content',$('.quickcart .ajaxcart').html()), r);
            }

        });
    });
}

function displayCart(el, r){

    el.popover("show");

    el.on('shown.bs.popover', function () {

        $(this).parent().find('.popover-content')
            .mouseenter(function(){
                if(cartCloseTimeout) clearTimeout(cartCloseTimeout);
            })
            .mouseleave(function(){
                if(cartCloseTimeout) clearTimeout(cartCloseTimeout);
                setTimeout(function(){
                    //el.popover("hide");
                    resetErrors();
                }, 500);
            });
    });

    cartCloseTimeout = setTimeout(function(){
        //el.popover("hide");
        resetErrors();
    }, 5000);
}

function resetErrors(){
    $('.ajaxcart .error').empty();
    $('.quickcart').attr('data-content',$('.quickcart .ajaxcart').html());
}
