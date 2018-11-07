var shippingMethods = [];
function estimator() {
    var zip_code = $('[name="cart[shipping_zip]"]').val();
    var shipping_method = $('[name="shipping_method"]:checked').val();
    var shipping_country = 'US';
    var shipping_state = $('[name="cart[state]"]').val();

    if(!zip_code) {  
          $('#summary-shipping,#summary-before-tax,#summary-tax').hide();
        //  return;
    } else {
           $('#summary-shipping').show();       
    }
    if(!zip_code) {
        $('#summary-before-tax,#summary-tax').hide();
    } else {

        $('#summary-before-tax,#summary-tax').show();
    }
    $.post(acendaBaseUrl + '/api/cart',{
        'shipping_method':shipping_method,
        'shipping_country':shipping_country,
        'shipping_state':shipping_state,
        'shipping_zip':zip_code
    }, 'json')
    .done(function(data) {
        if(typeof updateCartTotals !== 'undefined') {
            updateCartTotals($(''),0);
        }
    });
    
    return false;
}
function refreshShippingMethods() {
    if(typeof cartData === 'undefined' || cartData == null) {
        setTimeout(refreshShippingMethods,200);
        return;
    }
    var zip_code = $('[name="cart[shipping_zip]"]').val(); 
    var shipping_method_tpl = _.template($('#shipping-methods-template').html()); 
    $.get(acendaBaseUrl + '/api/shippingmethod/byregion?country=US', function(data) {
        var defer_methods = [];
        var first = true;
        var shipping_methods = data.result;   
        shipping_methods.forEach(function(method,k) {
                    defer_methods[k]=$.post(acendaBaseUrl + '/api/shippingmethod/' + method.id +  '/rate',{total: cartData.subtotal,quantity: cartData.item_count}, function(response) {
                        shipping_methods[k].price = response.result.rate;
                    })
                    first = false;
        });
        $.when.apply($,defer_methods).then(function() {
            console.log('got rates');
            $('#shipping-method-selection').html(shipping_method_tpl({methods: shipping_methods, current_method: cartData.shipping_method}));
            $('[name="shipping_method"]').change(function() {
                console.log('change');
                shipping_method = this.value;
                estimator();
            });            
        });
    });
}
$(document).ready(function() {
    refreshShippingMethods();


});

    $('#cart_Estimate').click(function(e) {
       e.preventDefault();
       estimator();
    });




