$('.form-region, .form-horizonal').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=country]',
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/shippingmethod/country', request, function(data) {
                var country = $('[name$=\\[country_select\\]]').val();
                if (country == undefined || country == '') {
                    country = 'US';
                }
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
            var state = $('[name$=\\[state_select\\]]').val();
            if (state == undefined || state == '') {
                state = 'CA';
            }
            var search_string = "country="+$('select[id$=country]').val();
            if ($('#state').val()) {
                search_string = search_string + '&state=' + $('#state').val();
            }
            $(".shipping-continue").prop("disabled",true);
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

            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
                var state = $('[name$=\\[state_select\\]]').val();
                if (state == undefined || state == '') {
                    state = 'CA';
                }
                if ($('select[id$=country]').val() == "US") {
                    $("#zip_field").html("Zip Code");
                } else {
                    $("#zip_field").html("Postal Code");
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

                    response($.map(data.result, function(item, index) {
                        return {
                            label: item.label,
                            value: item.value,
                            selected: item.value.indexOf(state) != -1
                        };
                    }));
                }

                console.log("State");
                console.log($('#state').val());
                var search_string = "country="+$('select[id$=country]').val();
                if ($('#state').val()) {
                    search_string = search_string + '&state=' + $('#state').val();
                }
                $(".shipping-continue").prop("disabled",true);
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
            });
        },
    }
    ]
});

// Billing address form
$('.form-billing-region, .form-horizonal').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=country]',
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/payment/country', request, function(data) {
                var country = $('[name$=\\[country_select\\]]').val();
                if (country == undefined || country == '') {
                    country = 'US';
                }
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
        selector: 'select[id$=state]',
        requires: ['select[id$=country]'],
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
                var state = $('[name$=\\[state_select\\]]').val();
                if (state == undefined || state == '') {
                    state = 'CA';
                }
                if ($('select[id$=country]').val() == "US") {
                    $("#zip_field").html("Zip Code");
                } else {
                    $("#zip_field").html("Postal Code");
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

$('.form-region-customer, .form-horizonal').cascadingDropdown({
    selectBoxes: [
    {
        selector: 'select[id$=country]',
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/region', request, function(data) {
                var country = $('[name$=\\[country_select\\]]').val();
                if (country == undefined || country == '') {
                    country = 'US';
                }
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
        source: function(request, response) {
            $.getJSON(acendaBaseUrl + '/api/region/states/'+$('select[id$=country]').val(), request, function(data) {
                var state = $('[name$=\\[state_select\\]]').val();
                if (state == undefined || state == '') {
                    state = 'CA';
                }
                if ($('select[id$=country]').val() == "US") {
                    $("#zip_field").html("Zip Code");
                } else {
                    $("#zip_field").html("Postal Code");
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
