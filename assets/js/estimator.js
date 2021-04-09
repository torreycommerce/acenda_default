var shipping_methods = [];
function getTaxEstimates() {
    var zip_code = $('[name="cart[shipping_zip]"]').val();
    var shipping_method = $('[name="shipping_method"]:checked').val();
    var shipping_country = 'US';
    var shipping_state = $('[name="cart[state]"]').val();
    if (!zip_code) {
        $('#summary-shipping,#summary-before-tax,#summary-tax').hide();
        //  return;
    } else {
        $('#summary-shipping').show();
    }
    if (!zip_code) {
        $('#summary-before-tax,#summary-tax').hide();
    } else {
        $('#summary-before-tax,#summary-tax').show();
    }
    $.post(acendaBaseUrl + '/api/cart', {
        'shipping_method': shipping_method,
        'shipping_country': shipping_country,
        'shipping_state': shipping_state,
        'shipping_zip': zip_code
    }, 'json')
        .done(function () {
            if (typeof updateCartTotals !== 'undefined') {
                updateCartTotals($(''), 0);
            }
            getDeliveryEstimates(shipping_methods);
        });
    return false;
}
function getDeliveryEstimates(shipping_methods) {
    if (!$('[name="cart[shipping_zip]"]').val()) return;
    shipping_methods.forEach(function (method) {
        console.log('getting estimate for ' + method.id);
        $('tr[data-method="' + method.id + '"] .spinner').show();
        $.get(acendaBaseUrl + '/api/shippingtools/deliveryestimates/?carrier=' + method.carrier_name).done(function (data) {
            var estimates = data.result;
            $.each(estimates, function (ek, estimate) {
                if (typeof estimate.estimate == 'undefined') return;
                var estimate_string = moment(estimate.estimate).calendar(null, {
                    sameDay: 'By [Today]',
                    nextDay: 'By [Tomorrow], MM/DD',
                    nextWeek: 'By dddd, MM/DD',
                    lastDay: '[Yesterday], MM/DD',
                    lastWeek: '[Last] dddd, MM/DD',
                    sameElse: 'By MM/DD/YYYY'
                });
            });
        }).always(function () {
            $('tr[data-method="' + method.id + '"] .spinner').hide();
        })
    });
}
function refreshShippingMethods() {
    if (typeof cartData === 'undefined' || cartData == null) {
        setTimeout(refreshShippingMethods, 200);
        return;
    }
    var shipping_method_tpl = _.template($('#shipping-methods-template').html());
    var defer_methods = [];
    if (shippingByWeight) {
        shipping_methods = cartData.shipping_methods;
        shipping_methods.forEach(function (method, k) {
            shipping_methods[k].bottom_days_range = method.bottom_days_range.toString();
            shipping_methods[k].carrier_method = "Carrier Method";
            shipping_methods[k].carrier_name = "Carrier Method";
            shipping_methods[k].delivery_estimates = "manual";
            shipping_methods[k].price = method.shipping_rate;
            shipping_methods[k].status = 'active';
            shipping_methods[k].top_days_range = method.top_days_range.toString();
            shipping_methods[k].rule_by = 'bottom_price';
            defer_methods.push(k);
            defer_methods[k].rate = method.shipping_rate;
            defer_methods[k].date_range = [method.shipping_estimate_start, method.shipping_estimate_end];
        });
    } else {
        $.get(acendaBaseUrl + '/api/shippingmethod/byregion?country=US', function (data) {
            shipping_methods = data.result;
            shipping_methods.forEach(function (method, k) {
                defer_methods[k] = $.post(acendaBaseUrl + '/api/shippingmethod/' + method.id + '/rate', { total: cartData.subtotal, quantity: cartData.item_count }, function (response) {
                    shipping_methods[k].price = response.result.rate;
                })
            });
        });
    }
    $.when.apply($, defer_methods).then(function () {
        $('#shipping-method-selection').html(shipping_method_tpl({ methods: shipping_methods, current_method: cartData.shipping_method }));
        getDeliveryEstimates(shipping_methods);
        $('[name="shipping_method"]').change(function () {
            var shipping_method = $('[name="shipping_method"]:checked').val();
            $.post(acendaBaseUrl + '/api/cart', {
                'shipping_method': shipping_method
            }, 'json')
                .done(function () {
                    if (typeof updateCartTotals !== 'undefined') {
                        updateCartTotals($(''), 0);
                    }
                });
        });
    });
}
$(document).ready(function () {
    refreshShippingMethods();
});
$('#cart_Estimate').click(function (e) {
    e.preventDefault();
    getTaxEstimates();
});