/* Options: maybe controlled through Admin at some point */
//
var useDatePicker = 0; // use date input calendar art?
//
var useGMapNorm = 0; // use google map normalizer?
//
var useIntTel = 0; // use InternationlTel flag art?
var telReady = 0;
//
var useTypeAhead = 1; // use Twitter TypeAhead?
/* */



(function($){
   var ImageZoom = function(element, options)
   {
	  var elem = $(element);
	  var obj = this;
	elem.panzoom({
	  contain: "invert",
	  minScale: 1,
	  disablePan: true
	  })
	.on({ 'touchstart' : function(e){
		$(this).data.mouseXY = e.touches[0].pageX+':'+e.touches[0].pageY;
		var d = new Date();
		if($(this).data.touchTime && $(this).data.touchTime>d.getTime()) {
		  if($(this).panzoom('getScale') > 1) {
			$(this).panzoom('reset');
			$(this).panzoom('disablePan');
			$(this).attr('src',$(this).data.originalImage);
		  } else {
			var big = $(this).attr('data-zoomify');
			$(this).data.originalImage = $(this).attr('src');
			if(big != '' && big !== true) {
				$(this).attr('src',$(this).attr('data-image-zoom'));
			}

			$(this).panzoom('enablePan').panzoom("zoom",2,{animate:true});
		  }
		}
		$(this).data.touchTime = d.getTime()+400;
	  }})
	.on({ 'mousedown' : function(e){
		$(this).data.mouseXY = e.pageX+':'+e.pageY;
	  }})
	.click(function(e){
		if('ontouchstart' in document.documentElement) return;
		if($(this).panzoom('getScale') <= 1) {
			$(this).addClass('zoomed',1000);

			var big = $(this).attr('data-zoomify');
			$(this).data.originalImage = $(this).attr('src');
			if(big != '' && big !== true) {
				$(this).attr('src',$(this).attr('data-image-zoom'));
			}

			$(this).panzoom('enablePan').panzoom("zoom",2,{animate:true});
		} else if((e.pageX+':'+e.pageY) == $(this).data.mouseXY) {
			$(this).attr('src',$(this).data.originalImage);
			$(this).removeClass('zoomed',1000);
			$(this).panzoom('reset');
		}
	})
   };
$.fn.imageZoom = function(options)
	{
		return this.each(function()
		{
			var element = $(this);

			// Return early if this element already has a plugin instance
			if (element.data('ImageZoom')) return;
			// pass options to plugin constructor
			var imageZoom = new ImageZoom(this, options);
			// Store plugin object in this element's data
			element.data('ImageZoom', imageZoom);
		});
	};

})(jQuery);

$(document).ready(function() {

   $('[data-tooltip]').tooltip();


  $(window).scroll(function () {
	if ($(window).scrollTop() > 1) {
	  $('html').addClass('scrolled');
	} else {
	  $('html').removeClass('scrolled');
	}
  });



   $('[data-image-zoom]').imageZoom();
   $(".container").on("click", "[data-image-swap]", function() {
	  var src = $(this).attr('data-image-swap-src');
	  var el = $('#'+$(this).attr('data-image-swap'));
	  var srczoom = $(this).attr('data-image-swap-zoom');
	  var alt = $(this).attr('alt');
	  el.removeClass('zoomed',1000);
	  el.panzoom('reset');
	  el.attr('src',src);
	  el.attr('alt',alt);
	  el.attr('data-image-zoom',srczoom);
   });


   $('.navbar .nav li a').click(function(){
	  if($(this).attr('target') == undefined){
		  window.location=($(this).attr('href'));
	  }
  });



});

// Disable Console.log for browsers that dont support it or if debugging
var debugging = true; // or true
if (typeof console == "undefined") var console = { log: function() {} };
else if (!debugging || typeof console.log == "undefined") console.log = function() {};

// if IE7, convert inline-blocks to inline zoom 1
function fixInlineBlocks(selector) {

	  $(selector).each(function (i) {
			if ($(this).css('display') == "inline-block") {
				 $(this).css('display','inline');
				 $(this).css('zoom','1');

			}
	  });
}

// Don't need document.ready since our script is getting loaded at the bottom of the page instead of in <head>

$(document).ready(function() {
	$('#productForm').submit(function() {
		sum = 0;
		$('#productForm input:text').each(function() {
			if (!isNaN($(this).val())) {
				sum += parseInt($(this).val());
			}
		});
		if (sum === 0) {
			alert('Need to enter a quantity!');
			return false;
		} else {
			return true;
		}
	});
});

// Parsley settings
$(document).ready(function () {
	$("input[data-metatype='phone']").mask("(999) 999-9999");

	var limit_feed = ["text", "tel", "email", "password", "url", "datetime", "time", "number"];

	$('form').each(function() {
		$(this).parsley({
			successClass: 'has-success',
			errorClass: 'has-error',
			errors: {
				classHandler: function(el) {
					return el.parent();
				},
				errorsWrapper: '',
				errorElem: ''
			},
			listeners: {
				onFieldError: function ( elem, constraints, ParsleyField ) {
					if (!elem.parents('.form-group').hasClass('has-feedback'))
						elem.parents('.form-group').addClass('has-feedback');

					if ($.inArray(elem[0].type, limit_feed) >= 0){
					  if (elem.parent().find(".fa"))
						  elem.parent().find(".fa").remove();
					  elem.after('<span class="fa fa-exclamation-triangle form-control-feedback"></span>');
					}

					elem.attr("data-original-title", elem[0].validationMessage);
					elem.tooltip("show");
				},
				onFieldSuccess: function ( elem, constraints, ParsleyField ) {					
					if (!elem.parents('.form-group').hasClass('has-feedback'))
						elem.parents('.form-group').addClass('has-feedback');
					if ($.inArray(elem[0].type, limit_feed) >= 0){
					  if (elem.parent().find(".fa"))
						  elem.parent().find(".fa").remove();
					  elem.after('<span class="fa fa-ok form-control-feedback"></span>');
					}

					elem.tooltip("destroy");
				}
			}
		});
	});
});


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
				if (data.code === 400 && model === 'sessioncartitem') { // Bad request for the cart - not enough inventory
					qtyField.parents('.item').find('.error').html('Not enough inventory to add more items!');
				} else { // Probably a connection failure
					qtyField.parents('.item').find('.error').html('Unknown error: could not update quantity.');
				}
				qtyField.parents('.item').find('.error').show();
			}).done(function(e) {
				if (model === 'sessioncartitem') { // Check if we're at the cart, and if so, update the cart subtotal/individual item totals
					updateCartTotals(qtyField, id);
				}
			});
		}
	}
}

// Updates the subtotal and current item total.
function updateCartTotals(qtyField, cartItemId) {
	$.getJSON(acendaBaseUrl + '/api/sessioncart')
	.always(function(e) {
		$('#subtotal').css({'opacity':1});
	})
	.done(function(data) {
		// Different field name if it's a sale amount vs. regular
		if (qtyField.parents('.item').find('.sale').length) {
			var priceElement = qtyField.parents('.item').find('.sale .amount');
		} else {
			var priceElement = qtyField.parents('.item').find('.regular .amount');
		}

		var amount = priceElement.find('.dollars').html() + '.' + priceElement.find('.cents').html();
		amount = parseFloat(amount * data.result.items[cartItemId].quantity).toFixed(2);

		// Line item amount
		var item_amount = amount.split('.');
		// toLocaleString for the commas
		qtyField.parents('.item').find('.total .dollars').html(parseInt(item_amount[0]).toLocaleString());
		qtyField.parents('.item').find('.total .cents').html(item_amount[1]);

		// Subtotal
		var result = data.result.subtotal.split('.');
		// toLocaleString for the commas
		$('#subtotal .amount .dollars').html(parseInt(result[0]).toLocaleString());
		$('#subtotal .amount .cents').html(result[1]);
	});
}

$('div#wishlist .modal_list_quantity, div#registry .modal_list_quantity').on('hidden.bs.modal', function () {
	document.location.reload();
})

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

if ($('.panel-tabs li:eq(1) a').length && $('.read-more').length)
  $('.read-more').click(function(){
	$('.panel-tabs li:eq(1) a').click();
	$("html, body").animate({ scrollTop: 600 }, 600);
  })

// Show product tab when add to cart below is clicked on collections pages
$('.btn-add-to-cart').click(function (e) {
  $('.panel-tabs a[href="#children"]').tab('show');
})

// client.on( "load", function(client) {
//   client.on( "complete", function(client, args) {
//       $('#btn-share').popover('show');
//       setTimeout(function(){$('#btn-share').popover('hide');}, 3000);
//   } );
// } );


/* params */
function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])]
		= decodeURIComponent(tokens[2]);
	}

	return params;
}
var desire = getQueryParams(document.location.search);
/* */

function IncludeJavaScript(jsFile, onLoadCallback) {
	var head = document.getElementsByTagName('head')[0] || document.documentElement;
	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.async = true;
	s.src = jsFile;
	if (onLoadCallback) {
		s.onload = s.onreadystatechange = function() {
			if (!s.readyState || s.readyState == 'loaded' || s.readyState == 'complete') {
				s.onreadystatechange = null;
				onLoadCallback(s);
			}
		};
	}
	head.appendChild(s);
}


$(document).ready(function() {
	$.ajaxSetup ({
   	 // Disable caching of AJAX responses
	    cache: false
	});	
	$.get(acendaBaseUrl+'/account/toolbar', function(data) {
		$('.toolbarajax').replaceWith(data);
		//
		$('.flashajax').load(acendaBaseUrl+'/account/flashes');
		//
		$('.navajax').load(acendaBaseUrl+'/account/nav', function() {
			//alert( "Load was performed." );
			IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/yta-menu.js",function(){
			});
		});
		//
		$.getJSON(acendaBaseUrl + '/api/sessioncart', function(data) {
			$('li.cart a.tool-tab span.item-count').html(data.result.item_count);
		});
		//$('li.tool .my-account').load(acendaBaseUrl + '/account/toolbar');
		//
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/quickcart.js",function(){
		});
		//
		var timer=0;
		timer = setTimeout(function() {  $('#admin-bar').fadeOut('slow'); timer=0; },2000);
		$('#admin-bar').hover(function() {
			clearTimeout(timer);
		},function() {
			if(timer) clearTimeout(timer);
				timer = setTimeout(function() {  $('#admin-bar').fadeOut('slow'); timer=0; },2000);
		})
		$(window).scroll(function() {
			$('#admin-bar').fadeIn('slow');
			if(timer) clearTimeout(timer);
				timer = setTimeout(function() {  $('#admin-bar').fadeOut('slow'); timer=0; },2000);
		});
	});
	//
	$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/fonts/font-awesome-4.7.0/css/font-awecenda.min.css">');
	//
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/signup.js",function(){
	});
});

if (useDatePicker) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/bootstrap-datepicker.js",function(){
		$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/css/theme/datepicker.css">');
		$('input[datepicker=1]').datepicker({
			format: 'yyyy-mm-dd'
		});
	});
}
//
if (useGMapNorm) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/google_map_normalizer.js",function(){
	});
}
//
if (useIntTel) {
	function numbersonly(myfield, e, dec) {
		var key;
		var keychar;
		if (window.event)
			key = window.event.keyCode;
		else if (e)
			key = e.which;
		else return true;
			keychar = String.fromCharCode(key);
		// control keys
		if ((key==null) || (key==0) || (key==8) || (key==9) || (key==13) || (key==27) )
			return true;
		// numbers
		else if ((("0123456789").indexOf(keychar) > -1)) return true;
		// decimal point jump
		else if (dec && (keychar == ".")) {
			myfield.form.elements[dec].focus(); return false;
		}
		else
			return false;
	}

	IncludeJavaScript(acendaBaseThemeUrl+"/assets/intl-tel-input/build/js/intlTelInput.js",function(){
    	telReady = 1;
		$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/intl-tel-input/build/css/intlTelInput.css">');
		var input = $("#phone");
		input.intlTelInput({
			utilsScript: acendaBaseThemeUrl+"/assets/intl-tel-input/build/js/utils.js",
			nationalMode: true
		});
		input.on("keyup change", function() {
			$("#intlPhone").val(input.intlTelInput("getNumber"));
		});
	});
}
//


if (useTypeAhead) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/typeahead.js",function(){
		var searchCompleterCategory = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: {
		  url: acendaBaseUrl+'/api/category/tree',
		  ttl: 300000, //5 min cache
		  transform: function (response) {
			res = [];
			for(var k in response.result) {
				var v = k.replace('-',' ').replace('/',' > ').replace(/\w+/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				res.push({'value':v, 'url':acendaBaseUrl+'/category/'+k});
			  }
			return res;
		  }
		}
		});

		var searchCompleterProduct = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
		  url: acendaBaseUrl+'/api/catalog/autocomplete?search=%QUERY',
		  wildcard: '%QUERY',
		  transform: function (response) {
			res = [];
			for (var i = 0, len = response.result.length; i < len; i++) {
			  res.push({'value':response.result[i]});
			}
			return res;
		  }
		}
		});
		//
		$('.search-autocomplete').typeahead(null,
			{
				name: 'search',
				display: 'value',
				source: searchCompleterCategory
			},
			{
				name: 'search',
				display: 'value',
				source: searchCompleterProduct
			}
		).on('typeahead:selected', function(event, selection) {
			if('url' in selection) {
				window.location=selection.url;
			}
		});
	});
}

/* stores all */
/* store locator */
function ChangeUrl(title, url) {
	if (typeof (history.pushState) != "undefined") {
		console.log('can pushState')
		var obj = { Title: title, Url: url };
		history.pushState(obj, obj.Title, obj.Url);
	} else {
		console.log('can not pushState')
		//alert("Browser does not support HTML5.");
	}
}

function updateUrlParameter(param, value) {
	const regExp = new RegExp(param + "(.+?)(&|$)", "g");
	const newUrl = window.location.href.replace(regExp, param + "=" + value + "$2");
	window.history.pushState("", "", newUrl);
}

function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])]
			= decodeURIComponent(tokens[2]);
	}

	return params;
}

var desire = getQueryParams(document.location.search);

/* stores */
var mapReady = setInterval(function(){
	if (typeof jQuery != 'undefined' && ($('#map').length || $('#search-locs').length)) {
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/locations.js",function(){
			$('body').append('<script src="https://maps.googleapis.com/maps/api/js?key='+gMapApiKey+'&libraries=places&rankby=distance&callback=acendaMaps" async defer></script>');
			clearInterval(mapReady);
		});
	}
},1000);

// final
IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/acended.js",function(){
});