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
	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) { options.async = true; });
	$.get(acendaBaseUrl+'/account/tools.html', function(data) {
		$('#header .my-account').append(data);
		//
		$('.flashajax').load(acendaBaseUrl+'/account/flashes');
		//
		$('.yta-launch').parent().after('<div class="navajax"></div>');
	    $('.navajax').load(acendaBaseUrl+'/account/nav.html', function() {
			IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/yta-menu.js",function(){
			});
		});
		//
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/quickcart.js",function(){
		});
	});
	//
	$('head').append('<link rel="stylesheet" type="text/css" href="'+acendaBaseThemeUrl+'/assets/fonts/fa-5.1.0/css/trim.css">');
	//
	$(document).on('click','[data-image-swap]', function() {
        var src = $(this).attr('data-image-swap-src');
        var el = $('#'+$(this).attr('data-image-swap'));
        el.attr('src',src);
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
	//
	//
	$('a.btn[data-toggle=dropdown]').click(function () {
        if ($(this).attr('href')){
            window.location = $(this).attr('href');
        }
    });
	$(document).on('click','.addAccess a[data-toggle=dropdown]', function() {
        if ($(this).attr('href')){
            window.location = $(this).attr('href');
        }
    });
});


$('img').on( "error", function() {
    if ($(this).attr('width') == "450") {
        $(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-450x450.gif');
    } else {
        $(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-250x250.gif');
    }
});


$(window).on("load", function (e) {
	$('img').each(function() {
		if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
			if ($(this).attr('width') == "450") {
                $(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-450x450.gif');
            } else {
                $(this).attr('src',acendaBaseThemeUrl+'/assets/images/product/image-250x250.gif');
            }
		}
	});
});



$('#nav .navbar-nav > li > ul').each(function() {
    if ($(this).children('li').length > 10) {
        $(this).parent('li').addClass('make-cols');
    }
});



$('body').on('mouseenter mouseleave','.addAccess > li',function(e){
    //var _d=$(e.target).closest('.dropdown');
    var _d=$(this);
    var _e=$(_d).find('.dropdown-menu:first');_e.addClass('show');
    setTimeout(function(){
        _e[_d.is(':hover')?'addClass':'removeClass']('show');
        $('[data-toggle="dropdown"]', _d).attr('aria-expanded',_d.is(':hover'));
    },25);
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
	$('.slick-heroic-go .d-none, .slick-heroic-nav-go .d-none').removeClass('d-none');
	$('.slick-heroic-go').removeClass('slick-heroic-go');
	$('.slick-heroic-nav-go').removeClass('slick-heroic-nav-go');
    
	if ($.fn.easyZoom) {
	    $('#slick-heroic-'+who+' .easyzoom').easyZoom();
    }

}


if ($('.slick').length) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/slick/slick-1.9.0.min.js",function(){
		slickReady = 1;
		$('.slick-1').each(function() {
		    var togArrows = $(this).hasClass('use-arrows') ? true : false;
		    var togDots = $(this).hasClass('use-dots') ? true : false;
			$(this).slick({
			    arrows: togArrows,
        		dots: togDots,
        		//infinite: false,
        		speed: 500,
        		slidesToShow: 1,
        		slidesToScroll: 1,
        		fade: true,
                cssEase: 'linear'
        	});
        	$(this).find('.d-none').removeClass('d-none');
		});
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
                    if ($('.easyzoom').length) {
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
                    }
    			});
    		});
    	});
    });
}






/* stores all */
/* store locator */
function ChangeUrl(title, url) {
	if (typeof (history.pushState) != "undefined") {
		var obj = { Title: title, Url: url };
		history.pushState(obj, obj.Title, obj.Url);
	} else {
		//alert("Browser does not support HTML5.");
	}
}

function updateUrlParameter(param, value) {
	const regExp = new RegExp(param + "(.+?)(&|$)", "g");
	const newUrl = window.location.href.replace(regExp, param + "=" + value + "$2");
	window.history.pushState("", "", newUrl);
	//window.history.replaceState("", "", newUrl);
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


var updateQueryStringParam = function (key, value) {
//console.log('uQSP key: '+key+' , value: '+value)
    var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
        urlQueryString = document.location.search,
        newParam = key + '=' + value,
        params = '?' + newParam;

    //console.log('urlQS v10');
    // If the "search" string exists, then build params from it
    //if (urlQueryString) {
    if (urlQueryString) {

        updateRegex = new RegExp('([\?&])' + key + '[^&]*');
        removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');
        //console.log('has urlQS');
        if( typeof value == 'undefined' || value == null || value == '' ) { // Remove param if value is empty
            //console.log('path 1');
            if (urlQueryString.indexOf(key) !== -1) {
                //console.log('path 1 actual MODDed');
                params = urlQueryString.replace(removeRegex, "$1");
                //params = urlQueryString.replace(updateRegex, "$1" + newParam); me
                params = params.replace( /[&;]$/, "" );
            }

        } else if (urlQueryString.match(updateRegex) !== null) { // If param exists already, update it
           // console.log('path 2');
            params = urlQueryString.replace(updateRegex, "$1" + newParam);

        } else { // Otherwise, add it to end of query string
            //console.log('path 3');
            params = urlQueryString + '&' + newParam;

        }
        //window.history.pushState({}, "", baseUrl + params);

    } else {
        //console.log('has NO urlQS');
        //window.history.pushState({}, "", baseUrl);
    }
    params = params == '?' ? '' : params;
    
    window.history.pushState({}, "", baseUrl + params);
};



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
