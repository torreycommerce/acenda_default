
$('.form-region').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=checkout_shipping_address_id]',
        onChange: function(event, id) {
            if (id !== undefined && id !== ""){
                $.getJSON(acendaBaseUrl + '/api/customeraddress/'+id, function(data) {
                    var search_string = "country="+data.result.country;
                        search_string = search_string + '&state=' + data.result.state;
                    $("#phone").intlTelInput("setCountry", data.result.country.toLowerCase());
                    $(".shipping-continue").prop("disabled",true);
                    $.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
                        var dropdown = $( "#shipping_method" );
                        dropdown.empty();
                        if (typeof data.result !== 'undefined' && data.result.length > 0) {
                            $.each(data.result, function( index, method ) {
                                var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
                                dropdown.append(option);
                            });
                            $("select[id$=checkout_shipping_address_id]").prop("disabled",false);
                        } else {
                            $("select[id$=checkout_shipping_address_id]").prop("disabled",true);
                        }
                    });
                });
            }
        },
        source: function(request, response) {
            var id = $('select[id$=checkout_shipping_address_id]').val();
            if (id !== "" && id !== undefined){
                $.getJSON(acendaBaseUrl + '/api/customeraddress/'+id, function(data) {
                    var search_string = "country="+data.result.country;
                        search_string = search_string + '&state=' + data.result.state;
                    $("#phone").intlTelInput("setCountry", data.result.country.toLowerCase());
                    $(".shipping-continue").prop("disabled",true);
                    $.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
                        var dropdown = $( "#shipping_method" );
                        dropdown.empty();
                        if (typeof data.result !== 'undefined' && data.result.length > 0) {
                            $.each(data.result, function( index, method ) {
                                var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
                                dropdown.append(option);
                            });
                            $("select[id$=checkout_shipping_address_id]").prop("disabled",false);
                        } else {
                            $("select[id$=checkout_shipping_address_id]").prop("disabled",true);
                        }
                    });
                });
            }else{
                $("select[id$=checkout_shipping_address_id]").prop("disabled",false);
            }
        }
    },
    {
        selector: 'select[id$=country]',
        source: function(request, response) {
            $("#state_input").show();
            $("#state_input").prop( "disabled", false );
            $("#state_select").hide();
            $("#state_select").prop( "disabled", true );

            $.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
                var country = $('[name$=\\[country_select\\]]').val();
                if ((country == undefined || country == '') && data.result.length > 0) {
                    country = data.result[0].value;
                }

                $("#phone").intlTelInput("setCountry", country.toLowerCase());

                response($.map(data.result, function(item, index) {
                    return {
                        label: item.label,
                        value: item.value,
                        selected: item.value.indexOf(country) != -1
                    };
                }));
            });
        }
    },
    {
        selector: 'select[id$=state_select]',
        requires: ['select[id$=country]'],
        onChange: function(event, allValues) {

            var state = $('[id$=\\[state_select\\]]').val();
            if (state == undefined || state == '') {
                state = 'CA';
            }
            var search_string = "country="+$('select[id$=country]').val();
                search_string = search_string + '&state=' + state;
            $(".shipping-continue").prop("disabled",true);
            $("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());
            $.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
                var dropdown = $( ".shipping-method-dropdown" );
                dropdown.empty();
                if (typeof data.result !== 'undefined' && data.result.length > 0) {
                    $.each(data.result, function( index, method ) {
                        var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
                        dropdown.append(option);
                    });
                    $(".shipping-continue").prop("disabled",false);
                } else {
                    $(".shipping-continue").prop("disabled",true);
                }
            });
        },
        source: function(request, response) {

            $("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());

            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
                var state = $('[id$=\\[state_select\\]]').val();
                if ((state == undefined || state == '') && data.result.length > 0) {
                    state = data.result[0].value;
                }
                if ($('select[id$=country]').val() == "US") {
                    $("#zip_field").html("Zip Code");
                    $('input[placeholder="Postal Code"]').attr('placeholder','Zip');
                } else {
                    $("#zip_field").html("Postal Code");
                    $('input[placeholder="Zip"]').attr('placeholder','Postal Code');
                }

                if (typeof data.result !== 'undefined') {

                    //If State array is empty, then show state as a text input.
                    if (!$.isArray(data.result) || ($.isArray(data.result) && data.result.length == 0)) {
                        $("#state_input").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
                        $("#state_select").addClass('hidden').prop( "disabled", true ).hide();
                    } else {
                        $("#state_input").addClass('hidden').hide().prop( "disabled", true );
                        $("#state_select").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
                    }

                    response($.map(data.result, function(item, index) {
                        return {
                            label: item.label,
                            value: item.value,
                            selected: item.value.indexOf(state) != -1
                        };
                    }));
                }
                var search_string = "country="+$('select[id$=country]').val();
                if ($('#state').val()) {
                    search_string = search_string + '&state=' + $('#state').val();
                }
                $(".shipping-continue").prop("disabled",true);
                $.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
                    var dropdown = $( "#shipping_method" );
                    dropdown.empty();
                    if (typeof data.result !== 'undefined' && data.result.length > 0) {
                        $.each(data.result, function( index, method ) {
                            var option = $('<option></option>').attr("value", method.id).text(method.name+" ("+method.bottom_days_range+" to "+method.top_days_range+" days)");
                            dropdown.append(option);
                        });
                        $(".shipping-continue").prop("disabled",false);
                    } else {
                        $(".shipping-continue").prop("disabled",true);
                    }
                });
            });
        },
    }
    ]
});

// Billing address form
$('.form-billing-region').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=country]',
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/payment/country', request, function(data) {
                var country = $('[name$=\\[country_select\\]]').val();
                if (data.result !== undefined && data.result.length > 0){ country = data.result[0].code; }

                $("#phone").intlTelInput("setCountry", country.toLowerCase());

                response($.map(data.result, function(item, index) {
                    return {
                        label: item.name,
                        value: item.code,
                        selected: item.code.indexOf(country) != -1
                    };
                }));
            });
        }
    },
    {
        selector: 'select[id$=state_select]',
        requires: ['select[id$=country]'],
        source: function(request, response) {
            console.log($('select[id$=country]').val());
            $("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());

            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
                var state = $('[id$=\\[state_select\\]]').val();
                if ((state == undefined || state == '') && data.result.length > 0) {
                    state = data.result[0].value;
                }
                if ($('select[id$=country]').val() == "US") {
                    $("#zip_field").html("Zip Code");
                   $('input[placeholder="Postal Code"]').attr('placeholder','Zip');
                } else {
                    $("#zip_field").html("Postal Code");
                    $('input[placeholder="Zip"]').attr('placeholder','Postal Code');
                }

                if (typeof data.result !== 'undefined') {

                    //If State array is empty, then show state as a text input.
                    if (!$.isArray(data.result) || ($.isArray(data.result) && data.result.length == 0)) {
                        $("#state_input").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
                        $("#state_select").addClass('hidden').prop( "disabled", true ).hide();
                    } else {
                        $("#state_input").addClass('hidden').hide().prop( "disabled", true );
                        $("#state_select").removeClass('hidden').prop( "disabled", false ).addClass('form-control').show();
                    }

                    response($.map(data.result, function(item, index) {
                        return {
                            label: item.label,
                            value: item.value,
                            selected: item.value.indexOf(state) != -1
                        };
                    }));
                }
            });
        },
    }
    ]
});

// Customer address
$('.form-region-customer').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=country]',
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/payment/country', request, function(data) {
                var billing_countries = $.map(data.result, function(item, index) {
                    return {
                        label: item.name,
                        value: item.code,
                    };
                });
                $.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
                    var countries = data.result.concat(billing_countries);
                    for(var i=0; i<countries.length; ++i) {
                        for(var j=i+1; j<countries.length; ++j) {
                            if(countries[i].value === countries[j].value)
                                countries.splice(j--, 1);
                        }
                    }

                    var country = $('[name$=\\[country_select\\]]').val();
                    if ((country == undefined || country == '') && data.result.length > 0) {
                        country = countries[0].value;
                    }
                    $("#phone").intlTelInput("setCountry", country.toLowerCase());
                    response($.map(countries, function(item, index) {
                        return {
                            label: item.label,
                            value: item.value,
                            selected: item.value.indexOf(country) != -1
                        };
                    }));
                });
            });
        }
    },
    {
        selector: 'select[id$=state_select]',
        requires: ['select[id$=country]'],
        source: function(request, response) {
            $("#phone").intlTelInput("setCountry", $('select[id$=country]').val().toLowerCase());
            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
                var state = $('[name$=\\[state_select\\]]').val();
                if ((state == undefined || state == '') && data.result.length > 0) {
                    state = data.result[0].value;
                }
                if ($('select[id$=country]').val() == "US") {
                    $("#zip_field").html("Zip Code");
                    $('input[placeholder="Postal Code"]').attr('placeholder','Zip');
                } else {
                    $("#zip_field").html("Postal Code");
                    $('input[placeholder="Zip"]').attr('placeholder','Postal Code');
                }

                if (typeof data.result !== 'undefined') {
                    //If State array is empty, then show state as a text input.
                    if ($.isArray(data.result) && data.result.length == 0) {
                        $("#state_input").show();
                        $("#state_input").prop( "disabled", false );
                        $("#state_select").hide();
                        $("#state_select").prop( "disabled", true );
                    }
                    else {
                        $("#state_input").hide();
                        $("#state_input").prop( "disabled", true );
                        $("#state_select").show();
                        $("#state_select").prop( "disabled", false );
                    }
                }

                response($.map(data.result, function(item, index) {
                    return {
                        label: item.label,
                        value: item.value,
                        selected: item.value.indexOf(state) != -1
                    };
                }));
            });
        },
    }
    ]
});

$('.form-estimate').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=cart_shipping_country]',
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
                if (data.result.length > 0){
                    country = data.result[0].value;
                    response($.map(data.result, function(item, index) {
                        return {
                            label: item.label,
                            value: item.value,
                            selected: item.value.indexOf(country) != -1
                        };
                    }));
                }
            });
        }
    },
    {
        selector: 'select[id$=cart_shipping_state]',
        requires: ['select[id$=cart_shipping_country]'],
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=cart_shipping_country]').val(), request, function(data) {

                if (data.result.length > 0){
                    if ($("select[id$=cart_shipping_country]").parent().hasClass('col-md-8')){
                        $("select[id$=cart_shipping_country]").parent().removeClass('col-md-8').addClass('col-md-4');
                        $("select[id$=cart_shipping_state]").parent().show();
                    }
                    state = data.result[0].value;
                    response($.map(data.result, function(item, index) {
                        return {
                            label: item.label,
                            value: item.value,
                            selected: item.value.indexOf(state) != -1
                        };
                    }));
                }else{
                    $("select[id$=cart_shipping_state]").parent().hide();
                    $("select[id$=cart_shipping_country]").parent().removeClass('col-md-4').addClass('col-md-8');

                    $("select[id$=cart_shipping_state]").val("");

                    var search_string = "country="+$('select[id$=cart_shipping_country]').val();
                    $.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, function(data) {
                        var dropdown = $( "#cart_shipping_method" );
                        dropdown.empty();
                        if (typeof data.result !== 'undefined' && data.result.length > 0) {
                            $.each(data.result, function( index, method ) {
                                var option = $('<option></option>').attr("value", method.id).text(method.name);
                                dropdown.append(option);
                            });

                            dropdown.prop("disabled",false);
                        }
                    });
                }
            });
        }
    },
    {
        selector: 'select[id$=cart_shipping_method]',
        requires: ['select[id$=cart_shipping_state]'],
        source: function(request, response) {
            var search_string = "country="+$('select[id$=cart_shipping_country]').val();
            if ($('select[id$=cart_shipping_state]').val() !== undefined){
                search_string += '&state=' + $('select[id$=cart_shipping_state]').val();
            }
            $.getJSON(acendaBaseUrl + '/api/shippingmethod/byregion?'+search_string, request, function(data) {
                shipping_method = data.result[0].id;

                response($.map(data.result, function(item, index) {
                    return {
                        label: item.name,
                        value: item.id
                    };
                }));
            });
        }
    }
    ]
});
