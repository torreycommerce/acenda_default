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
		$('.header .my-account').append(data);
		//
		$('.flashajax').load(acendaBaseUrl+'/account/flashes');
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
	if ($('.btn-add').length || $('.btn-qv').length) {
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/shop-qty.js",function(){
		});
	}
	//
	if ($('.btn-qv').length) {
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/quickview.js",function(){
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
	if ($('#SignupInput').length) IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/signup.js",function(){});
	//
	$('[data-tooltip]').tooltip();
	//
	$('a.btn[data-toggle=dropdown]').click(function () {
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




$('.header .navbar-nav > li > ul').each(function() {
	if ($(this).children('li').length > 10) {
		$(this).parent('li').addClass('make-cols')
	}
});

$('body').on('mouseenter','.add-access > .dropdown',function(e){
	if (window.innerWidth > 991.98) {
		addAccessShow($(this))
		navWait($(this))
	}
})

$('body').on('mouseleave','.add-access > .dropdown',function(e){
	if (window.innerWidth > 991.98) {
		addAccessHide($(this))
	}
})

$('body').on('focusin','.add-access a.nav-link',function(e){
	if (window.innerWidth > 991.98) {
		addAccessHide($(this).parents('.add-access').find('a.nav-link:not(:focus)').parents('.dropdown'))
		if ($(this).parents('.dropdown.show').length == 0) {
			addAccessShow($(this).parents('.dropdown'))
		}
	}
})

$('body').on('keydown','.add-access a.nav-link',function(e){
	if (window.innerWidth > 991.98) {
		if(e.shiftKey && e.keyCode == 9) {
			if($(this).parents('li').prev('li').length == 0) {
				addAccessHide($(this).parents('.dropdown'))
			}
		} else if(e.keyCode == 37) {
			e.preventDefault();
			if($(this).parents('li').prev('li').length == 0) {
				$(this).parents('ul').find('> li').last().find('a').first().focus();
			} else {
				$(this).parents('li').prev('li').find('a').first().focus();
			}
		} else if(e.keyCode == 39) {
			e.preventDefault();
			if($(this).parents('li').next('li').length == 0) {
				$(this).parents('ul').find('> li').first().find('a').first().focus();
			} else {
				$(this).parents('li').next('li').find('a').first().focus();
			}
		}
	}
})

$('body').on('keydown','.add-access a:last',function(e){
	if (window.innerWidth > 991.98) {
		addAccessHide($(this).parents('.dropdown'))
	}
})

$(document).click(function(e) {
	if (window.innerWidth > 991.98) {
		if(!$(e.target).closest('.add-access').length) {
			addAccessHide($('.add-access .dropdown'))
		}
	}
})

$('.add-access .dropdown-menu').on('show.bs.collapse', function () {
	$(this).parents('li').addClass('show')
})

$('.add-access .dropdown-menu').on('hide.bs.collapse', function () {
	$(this).parents('li').removeClass('show')
})

function addAccessShow(l) {
	$(l).find('.dropdown-menu:first').collapse('show')
}

function addAccessHide(l) {
	$(l).find('.dropdown-menu:first').collapse('hide')
}

function navWait(l) {
	setTimeout(function(){
		l[l.is(':hover')?'addClass':'removeClass']('show')
		l.find('.dropdown-menu:first').collapse([l.is(':hover')?'show':'hide'])
	},25)
}

$('body').on('mouseenter','.ace-bs-access:not(.show) [data-toggle=dropdown]',function(e){
	$(this).dropdown('toggle').addClass('ace-bs-accessed')
});
$('body').on('mouseleave','.ace-bs-access.dropdown',function(e){
	if ($(this).hasClass('show')) {
		$(this).find('.ace-bs-accessed[data-toggle=dropdown]').dropdown('toggle').removeClass('ace-bs-accessed')
	}
});

$('html').on("click", ".ttc", function() {
	if ($(this).attr('href')) {
		var ttc = $(this).attr('href');
		if ($(ttc).attr('role','tab')) $(ttc).click();
		$('body,html').animate({
			scrollTop: $(ttc).offset().top
		}, 300);
		return false;
	}
});

function detectScroll() {
	if ($(window).scrollTop() > 1) {
		$('html').addClass('scrolled')
	} else {
		$('html').removeClass('scrolled')
	}
}
detectScroll()
$(window).scroll(function () {
	detectScroll()
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
function productSlick() {
    var spslides = 6;
    if ($('.vari-video-scase').length) spslides = 5
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
	var navVert = true;
    if ($('.prodpage.ppsl-bh').length) navVert = false
	$('#slick-heroic-nav-'+who).slick({
        dots: false,
		speed: 300,
		slidesToShow: spslides,
		slidesToScroll: 1,
		vertical: navVert,
		asNavFor: '#slick-heroic-'+who,
		focusOnSelect: true,
		swipe: false
	});
	$('#slick-heroic-nav-'+who).slick('resize'); // why
	//
	$('.slick-heroic-go .d-none, .slick-heroic-nav-go .d-none').removeClass('d-none');
	$('.slick-heroic-go').removeClass('slick-heroic-go');
	$('.slick-heroic-nav-go').removeClass('slick-heroic-nav-go');
    
	if ($.fn.easyZoom) {
	    $('#slick-heroic-'+who+' .easyzoom').easyZoom();
    }

}


if ($('.slick').length || $('.btn-qv').length) {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/slick/slick-1.9.0.min.js",function(){
		slickReady = 1;
		$('.slick-1').each(function() {
			var togArrows = $(this).hasClass('use-arrows') ? true : false;
			var togDots = $(this).hasClass('use-dots') ? true : false;
			var togAuto= $(this).hasClass('use-auto') ? true : false;
			$(this).slick({
				arrows: togArrows,
				dots: togDots,
				//infinite: false,
				speed: 500,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: togAuto,
				autoplaySpeed: 5000,
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


function cartIsReady() {
	//console.log('cartIsReady')
	if (typeof lazyload == "undefined") {
		IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/lazyload.min.js",function(){
			lazyload()
			if ($('.url-1-product .ztrig').length) {
				productZooms()
			}
		});
	} else {
		lazyload()
	}
}

function productZooms() {
	IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/photoswipe.js",function() {
		if ($('.easyzoom').length) {
			var ezReady = setInterval(function(){
				if ($('html').hasClass('desktop')) {
					clearInterval(ezReady)
					IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/easyzoom.js",function() {
						$('.active .easyzoom').easyZoom()
					});
				}
			},1000);
		}
	});
}




/* stores all */
function ChangeUrl(title, url) {
	if (typeof (history.replaceState) != "undefined") {
		var obj = { Title: title, Url: url };
		history.replaceState(obj, obj.Title, obj.Url);
	} else {
		//alert("Browser does not support HTML5.");
	}
}

function updateUrlParameter(param, value) {
	const regExp = new RegExp(param + "(.+?)(&|$)", "g");
	const newUrl = window.location.href.replace(regExp, param + "=" + value + "$2");
	window.history.replaceState("", "", newUrl);
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
	var baseUrl = [location.protocol, '//', location.host, location.pathname].join(''),
		urlQueryString = document.location.search,
		newParam = key + '=' + value,
		params = '?' + newParam;

	// If the "search" string exists, then build params from it
	if (urlQueryString) {

		updateRegex = new RegExp('([\?&])' + key + '[^&]*');
		removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');
		if( typeof value == 'undefined' || value == null || value == '' ) { // Remove param if value is empty
			if (urlQueryString.indexOf(key) !== -1) {
				params = urlQueryString.replace(removeRegex, "$1");
				params = params.replace( /[&;]$/, "" );
			}

		} else if (urlQueryString.match(updateRegex) !== null) { // If param exists already, update it
			params = urlQueryString.replace(updateRegex, "$1" + newParam);

		} else { // Otherwise, add it to end of query string
			params = urlQueryString + '&' + newParam;

		}

	}
	params = params == '?' ? '' : params;

	window.history.replaceState({}, "", baseUrl + params);
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

IncludeJavaScript(acendaBaseThemeUrl+"/assets/js/device.min.js",function(){
});