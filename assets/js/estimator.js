function estimator() {
    var zip_code = $('[name="cart[zip_code]"]').val();
    var shipping_method = $('[name="cart[method]').val();
    var shipping_country = $('[name="cart[country]"]').val();
    var shipping_state = $('[name="cart[state]"]').val();

    $.post(acendaBaseUrl + '/api/cart',{
        shipping_method:shipping_method,
        shipping_country:shipping_country,
        shipping_state:shipping_state,
        shipping_zip:zip_code
    }, 'json')
    .done(function(data) {

        $.getJSON(acendaBaseUrl + '/api/cart')
        .then(function(response) {
            cart_data = response.result;
            $('#form').hide();
            $('#estimate').show();
            $('#rate-estimate').html('$' +  cart_data.shipping_rate);
            setRateEstimatedShipping(cart_data.shipping_rate);
            var total_before_tax = parseFloat(cart_data.subtotal) + parseFloat(cart_data.shipping_rate);
            var total_before_tax = total_before_tax.toFixed(2).toLocaleString();
            setTotalBeforeTax(total_before_tax);
            if (cart_data.shipping_estimate_end){
                $('#block-date-estimate').show();
                $('#date-estimate').html(cart_data.shipping_estimate_start + ' to ' + cart_data.shipping_estimate_end);
            }else{
                $('#block-date-estimate').hide();
            }
            $('#tax-estimate').html('$' + cart_data.tax_rate);
            setTaxEstimated(cart_data.tax_rate);
            var total = parseFloat(cart_data.subtotal) + parseFloat(cart_data.tax_rate) + parseFloat(cart_data.shipping_rate);
            $('#total-estimate').html('$' + total.toFixed(2).toLocaleString());
            setTotalEstimated(total.toFixed(2).toLocaleString());
        });
    });
    
    return false;
}

$('#cart_Estimate').click(function(e) {
    e.preventDefault();
    estimator();
});

$('#cart_ClearEstimate').click(function(e) {
    e.preventDefault();
    clearEstimated();
    $('#estimate').hide();
    $('#form').show();
});
function setRateEstimatedShipping(rate){
    $('#rate-estimate-checkout').find('.amount').text('$'+rate);
    $('#rate-estimate-checkout').show();
}
function setTaxEstimated(tax){
    $('#tax-estimate-checkout').find('.amount').text('$'+tax);
    $('#tax-estimate-checkout').show();
}
function setTotalEstimated(total){
    var estimate_total = $('#estimate-total').find('.amount');
    estimate_total.data("old-value", estimate_total.text());
    estimate_total.text('$'+total);
}
function setTotalBeforeTax(total){
    $('#total-before-tax').find('.amount').text('$'+total);
    $('#total-before-tax').show();
}
function clearEstimated(){
    $('#rate-estimate-checkout').hide();
    $('#tax-estimate-checkout').hide();
    $('#total-before-tax').hide();
    //Restore total
    var estimate_total = $('#estimate-total').find('.amount');
    estimate_total.text( estimate_total.data("old-value") );
}
