$(function() {
    var form = $('form[name=checkout],form[name=express],form[name=shipping]');
    var formName = form.attr('name');
    var stepName = $('input[name=step]').val(); // Gets the form prefix
    form.attachNormalizer({formPrefix:stepName});

    form.submit(function() {
        var currentTime = new Date()
        var month = currentTime.getMonth() + 1
        var year = currentTime.getFullYear()

        if (form.parsley('isValid') === false) {
            $(this).find('button[type="submit"]').attr('disabled', false).removeClass('wait');
            return false;
        } else if(($('select#state_select').length) && !$('select#state_select').prop('disabled') && !$('select#state_select').val()) {
            $('select#state_select').parent().addClass('is-invalid');
            return false;
        } else{
            if($('select#exp-y').val() == year && parseInt($('select#exp-m').val()) < month)
            {
                $(this).find('button[type="submit"]').attr('disabled', false).removeClass('wait');
                $('select#exp-y').parent().addClass('is-invalid');
                $('select#exp-m').parent().addClass('is-invalid');                
                console.log('card expired');
                return false;            
            } else {
                 $('select#exp-y').parent().removeClass('is-invalid'); 
                 $('select#exp-m').parent().removeClass('is-invalid');    
                 console.log('card not expired');                                         
            }

            if (form.normalized === true && !$("#custom-address").is(":hidden")) {
                $(this).find('button[type="submit"]').attr('disabled', true).addClass('wait');
                sessionStorage.setItem('selected_shipping_method_checkout', null);
                return true;
            }else if (form.normalized == undefined && ($("#custom-address").is(":hidden") || !$("#custom-address").length)){
                $(this).find('button[type="submit"]').attr('disabled', true).addClass('wait');
                sessionStorage.setItem('selected_shipping_method_checkout', null);
                return true;
            }
        }
    });
    $('select#state_select').change(function() {
        $('select#state_select').parent().removeClass('is-invalid');
    });
    $('select#exp-m,select#exp-y ').change(function() {
        var currentTime = new Date()
        var month = currentTime.getMonth() + 1
        var year = currentTime.getFullYear()        
        if($('select#exp-y').val() == year && parseInt($('select#exp-m').val()) < month)
        {
            $(this).find('button[type="submit"]').attr('disabled', false).removeClass('wait');
            $('select#exp-y').parent().addClass('is-invalid');
            $('select#exp-m').parent().addClass('is-invalid');                
            console.log('card expired');
            return false;            
        } else {
             $('select#exp-y').parent().removeClass('is-invalid'); 
             $('select#exp-m').parent().removeClass('is-invalid');                            
        }
    });


    // Remove constraints if address IDs are not set or undefined
    if (($('#checkout_shipping_address_id').val() != '' &&
        $('#checkout_shipping_address_id').val() != undefined) ||
        ($('#checkout_billing_address_id').val() != '' &&
        $('#checkout_billing_address_id').val() != undefined) ||
        ($('#express_shipping_address_id').val() != '' &&
        $('#express_shipping_address_id').val() != undefined)) {
        $('#custom-address').hide();
        $('#custom-address input[type="text"], #custom-address input[type="tel"]').each(function(index, elm) {
            $(this).parsley('removeConstraint','required');
        });
    }

    // Add/remove constraints based on selected address
    $('#checkout_shipping_address_id, #checkout_billing_address_id, #express_shipping_address_id').change(function() {
        if ($(this).val() != '') {
            $('#custom-address').slideUp();
            $('#custom-address input[type="text"], #custom-address input[type="tel"]').each(function(index, elm) {
                $(this).parsley('removeConstraint','required');
            });
        } else {
            $('#custom-address').slideDown();
            $('#custom-address input[type="text"], #custom-address input[type="tel"]').each(function(index, elm) {
                if (elm.name.indexOf('street_line2') === -1) {
                    $(this).parsley('addConstraint',{required:true});
                }
            });
        }
        updateEstimates();
    });

    function cardtype(number) {
        var re = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/
        };
        if (re.visa.test(number)) {
            return 'visa';
        } else if (re.mastercard.test(number)) {
            return 'mastercard';
        } else if (re.amex.test(number)) {
            return 'amex';
        } else if (re.discover.test(number)) {
            return 'discover';
        } else {
            return false;
        }
    }
    $('#shipping_method').change(function(){
        sessionStorage.setItem('selected_shipping_method_checkout', $('#shipping_method').val());
    })
    $('#checkout_card_number').keyup(function() {
        var type = cardtype($(this).val());
        $('.cc-visa,.cc-mastercard,.cc-amex,.cc-discover').fadeTo(0, 0.4);
        if (type) {
            $('.cc-' + type).fadeTo(0, 1);
        }
    });

    var setupCouponButtons = function () {
        $('button.remove-coupon').on('click',function() {
            var remId = $(this).attr('id').split('-')[2];
            $.post(acendaBaseUrl + '/cart/ajax.json', {cart: { action: 'removecoupon/' + remId}},function(data) {            
                $('div#summary-well').load(acendaBaseUrl + '/checkout/summary-ajax?step='+acendaCheckoutStep,function() {
                    updateEstimates();
                });      
            });
            return false;
        });
    }

    setupCouponButtons();
    $('button#checkout_enter_coupon').click(function() {
        var coupon_code = $('input#cart_coupon_code').val();
        $('#enter_coupon_validation').html('');
        if(coupon_code) {
            $(this).prop('disabled',true);
            $.post(acendaBaseUrl + '/cart/ajax.json', $('form[name=coupon]').serialize(),function(data) {
                $('button#checkout_enter_coupon').prop('disabled',false); 
                console.log(data.errors);             
                $('div#summary-well').load(acendaBaseUrl + '/checkout/summary-ajax?step='+acendaCheckoutStep,function() {
                    updateEstimates();
                    if(data.errors) {
                        $('#enter_coupon_validation').html('<small>'+data.errors+'</small>');   
                    }
                    setupCouponButtons();                    
                });                      
            });

        }
    });
});


