/* Options: maybe controlled through Admin at some point */
//
var useTypeAhead = 1; // use Twitter TypeAhead?
/* */



// Disable Console.log for browsers that dont support it or if debugging
var debugging = true; // or true
if (typeof console == "undefined") var console = { log: function() {} };
else if (!debugging || typeof console.log == "undefined") console.log = function() {};




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
	$.get(acendaBaseUrl+'/account/tools', function(data) {
		$('#tools').prepend(data);
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
	});
	//
	$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/fonts/font-awesome-4.7.0/css/font-awecenda.min.css">');
	//
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/jquery.zoomify.js",function(){
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/jquery.zoomcenda.js",function(){
		});
	});
	//
	if ($('.btn-add').length) {
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/shop-qty.js",function(){
		});
	}
	//
	if ($('form').length) {
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/parsley.min.js",function(){
			IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/parsley.extend.min.js",function(){
				IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/site-parsley.js",function(){
				});
			});
		});
	}
	//
	if ($('.star-rating-input').length) {
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/rating.js",function(){
		});
	}
	//
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/signup.js",function(){
	});
	//
	//
	$('[data-tooltip]').tooltip();
	//
	$('.navbar .nav li a').click(function(){
		if($(this).attr('target') == undefined){
			window.location=($(this).attr('href'));
		}
	});
});


$('img').error(function() {
	$(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-250x250.gif');
});

$(window).load(function() {
	$('img').each(function() {
		if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
			$(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-250x250.gif');	
		}
	});
});



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



$(document).click(function(e) {
    if (e.target.id != 'image-main' && !$('#image-main').find(e.target).length && !$('.vari-video-scase').find(e.target).length) {
        if ($('#image-main').hasClass('active')) {
            stopVideo();
        }
    }
});


var slickReady = 0;
var spslides = 6;
if ($('.vari-video-scase').length) spslides = 5
function productSlick() {
    var who = $('#product-images .active').attr('data-vid');
    $('#slick-heroic-'+who).slick({
		dots: false,
		fade: true,
		speed: 300,
		slidesToShow: 1,
		slidesToScroll: 1,
		asNavFor: '#slick-heroic-nav-'+who,
		swipe: true
	});
	$('#slick-heroic-nav-'+who).slick({
        dots: false,
		speed: 300,
		slidesToShow: spslides,
		slidesToScroll: 1,
		vertical: true,
		asNavFor: '#slick-heroic-'+who,
		focusOnSelect: true,
		swipe: false
	});
	$('#slick-heroic-nav-'+who).slick('resize'); // why
	//
	//
	$('.slick-heroic-go .hidden, .slick-heroic-nav-go .hidden').removeClass('hidden');
	$('.slick-heroic-go').removeClass('slick-heroic-go');
	$('.slick-heroic-nav-go').removeClass('slick-heroic-nav-go');
    
	if ($.fn.easyZoom) {
	    $('#slick-heroic-'+who+' .easyzoom').easyZoom();
    }

}


if ($('.slick').length) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/slick-1.7.1/slick.min.js",function(){
		slickReady = 1;
		if ($('.slick-heroic.slick-heroic-go').length) {
			//console.log('pS call s')
			productSlick();
		}
	});
}



if ($('.ztrig').length) {
    $.get(acendaBaseUrl+'/product/insert-photoswipe', function(data2) {
	    $('#product-images').append(data2);
        IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/photoswipe-mod.min.js",function() {
    		//console.log('ps 1 loaded');
    		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/photoswipe-ui-default.min.js",function() {
    			//console.log('ps 2 loaded');
    			IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/photoswipe-acenda.js",function() {
                    //console.log('ps 3 loaded');
                    var ezReady = setInterval(function(){
                        if ($('html').hasClass('desktop')) {
                            clearInterval(ezReady);
                            $.get(acendaBaseUrl+'/product/insert-easyzoom', function(data3) {
                                $('#product-images').append(data3);
                                IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/easyzoom.js",function() {
                                    $('#product-images .active .easyzoom').easyZoom();
                                });
                            });
                        }
                    },1000);
    			});
    		});
    	});
    });
}


if ($('select.vopt').length) {
    IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/jquery.selectric.mod.js",function(){
		$('select.vopt').on('change', function() {
			//console.log($(this).val())
			$('select.vopt').selectric('refresh');
			var desVal = $(this).val();
			var desInd = 0;
			$(this).find('option').each(function() {
				if ($(this).attr('value') == desVal) {
					desInd = $(this).attr('data-index');
					return false;
				}
			});
			$(this).parents('.selector-details').find('.selectric-vopt li[data-index="'+desInd+'"]').click();
		});
		//
		$('select.vopt').selectric({
			
		});
		//console.log('Selectric applied')
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
		clearInterval(mapReady);
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/locations.js",function(){
			$('body').append('<script src="https://maps.googleapis.com/maps/api/js?key='+gMapApiKey+'&libraries=places&rankby=distance&callback=acendaMaps" async defer></script>');
		});
	}
},1000);

// final
IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/acended.js",function(){
});
