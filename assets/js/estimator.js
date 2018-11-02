function estimator() {
    var zip_code = $('[name="cart[shipping_zip]"]').val();
    var shipping_method = $('[name="cart[method]"]').val();
    var shipping_country = 'US';
    var shipping_state = $('[name="cart[state]"]').val();

    if(!zip_code) {  
          $('#summary-shipping,#summary-before-tax,#summary-tax').hide();
          return;
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
    $('#rate-estimate-checkout .val').text(rate);
    $('#rate-estimate-checkout').show();
}
function setTaxEstimated(tax){
    $('#tax-estimate-checkout .val').text(tax);
    $('#tax-estimate-checkout').show();
}
function setTotalEstimated(total){
    var estimate_total = $('#estimate-total .val');
    estimate_total.data("old-value", estimate_total.text());
    estimate_total.text(total);
}
function setTotalBeforeTax(total){
    $('#total-before-tax .val').text(total);
    $('#total-before-tax').show();
}
function clearEstimated(){
    $('#rate-estimate-checkout').hide();
    $('#tax-estimate-checkout').hide();
    $('#total-before-tax').hide();
    //Restore total
    var estimate_total = $('#estimate-total .val');
    estimate_total.text( estimate_total.data("old-value") );
}



