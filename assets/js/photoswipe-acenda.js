$('html').on("click", ".active .slick-heroic .img-fluid", function() {
	var match = $(this).attr('src');
	fixSizes();
	$('#product-images .active.variation .ztrig img[src=\''+match+'\']').click();
});

$('html').on("click", ".easyzoom-flyout img", function() {
    var match = $(this).attr('src');
    fixSizes();
    $('#product-images .active.variation .ztrig[data-href=\''+match+'\'] img').click();
});


function fixSizes() {
    $('.active .ztrig').each(function() {
        var fact = 2.5; // 1500 / 600
        var i = $(this).find('img');
        var w = i.width();
        var h = i.height();
        var f = parseFloat(w / h).toFixed(0);
        var neww = parseFloat(fact * w).toFixed(0);
        var newh = parseFloat(fact * h).toFixed(0);
        $(this).attr('data-size',neww+'x'+newh).attr('data-med-size',w+'x'+h);
    });
}

function slickMatchZoom(a) {
    $('.slick-heroic,.slick-heroic-nav').slick('slickGoTo',parseInt(a-1));
}
//
var initPhotoSwipeFromDOM = function(gallerySelector) {
	function getParents(el, parentSelector /* optional */) {
		// If no parentSelector defined will bubble up all the way to *document*
		if (parentSelector === undefined) {
			parentSelector = document;
		}

		var parents = [];
		var mb-3 = el.parentNode;

		while (p !== parentSelector) {
			var o = p;
			parents.push(o);
			p = o.parentNode;
		}
		parents.push(parentSelector); // Push that parentSelector you wanted to stop at

		return parents;
	}

	var parseThumbnailElements = function(el) {
		var thumbElements = $(el).find('.ztrig'),//el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			el,
			childElements,
			thumbnailEl,
			size,
			item;
		//console.log(numNodes)
		for(var i = 0; i < numNodes; i++) {
			el = thumbElements[i];

			// include only element nodes 
			if(el.nodeType !== 1) {
			  continue;
			}

			childElements = el.children;

			size = el.getAttribute('data-size').split('x');

			// create slide object
			item = {
				src: el.getAttribute('data-href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				author: el.getAttribute('data-author')
			};

			item.el = el; // save link to element for getThumbBoundsFn

			if(childElements.length > 0) {
			  item.msrc = childElements[0].getAttribute('src'); // thumbnail url
			  if(childElements.length > 1) {
				  item.title = childElements[1].innerHTML; // caption (contents of figure)
			  }
			}


			var mediumSrc = el.getAttribute('data-med');
			if(mediumSrc) {
				size = el.getAttribute('data-med-size').split('x');
				// "medium-sized" image
				item.m = {
					src: mediumSrc,
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};
			}
			// original image
			item.o = {
				src: item.src,
				w: item.w,
				h: item.h
			};

			items.push(item);
		}
		return items;
	};

	// find nearest parent element
	var closest = function closest(el, fn) {
		return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	};

	var onThumbnailsClick = function(e) {
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		//console.log(w)
		if (w > 0) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;
			
			var clickedListItem = $(e.target).parents('.ztrig');
			//onsole.log('cLI:');
			//console.log(clickedListItem)
			
			if(!clickedListItem || $(e.target).is('.bgv')) {
				return;
			}

			var clickedGallery = $(e.target).parents('.variation');
			//console.log('cG:');
			//console.log(clickedGallery);
			
			if(!clickedGallery) {
				return;
			}

			//var childNodes = clickedListItem.parentNode.childNodes,
			var childNodes = $(clickedListItem).parents('.variation').find('.ztrig'),
				numChildNodes = childNodes.length,
				nodeIndex = 0,
				index;
			//console.log('cN:')
			//console.log(childNodes)
			//console.log('nCH:')
			//console.log(numChildNodes)
			for (var i = 0; i < numChildNodes; i++) {
				//console.log('f nCN')
				if(childNodes[i].nodeType !== 1) { 
					continue; 
				}
				
				//console.log('cN[i]:')
				//console.log($(childNodes[i]))
				//console.log('cLI')
				//console.log(clickedListItem)
					
				if($(childNodes[i]).attr('id') == $(clickedListItem).attr('id')) {
					//console.log('cN is cLI')
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}
			//console.log('i:')
			//console.log(index);
			if(index >= 0) {
				//console.log('open PS')
				openPhotoSwipe( index, clickedGallery );
			} else {
				//console.log('donot open PS')
			}
			return false;
		}
	};

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
		params = {};

		if(hash.length < 5) { // pid=1
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');  
			if(pair.length < 2) {
				continue;
			}           
			params[pair[0]] = pair[1];
		}

		if(params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
			gallery,
			options,
			items;

		items = parseThumbnailElements(galleryElement);

		// define options (if needed)
		options = {

			//galleryUID: galleryElement.getAttribute('data-pswp-uid'),
			captionEl: false,
			tapToClose: true,
			getThumbBoundsFn: function(index) {
				// See Options->getThumbBoundsFn section of docs for more info
				var thumbnail = items[index].el.children[0],
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect(); 

				return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
			}/*,
			
			addCaptionHTMLFn: function(item, captionEl, isFake) {
				captionEl = false;
				return false;
				if(!item.title) {
					//captionEl.children[0].innerText = '';
					captionEl = false;
					return false;
				}
				captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
				return true;
			}*/
			
		};


		if(fromURL) {
			if(options.galleryPIDs) {
				// parse real index when custom PIDs are used 
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for(var j = 0; j < items.length; j++) {
					if(items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if( isNaN(options.index) ) {
			return;
		}



		var radios = document.getElementsByName('gallery-style');
		for (var i = 0, length = radios.length; i < length; i++) {
			if (radios[i].checked) {
				if(radios[i].id == 'radio-all-controls') {

				} else if(radios[i].id == 'radio-minimal-black') {
					options.mainClass = 'pswp--minimal--dark';
					options.barsSize = {top:0,bottom:0};
					options.captionEl = false;
					options.fullscreenEl = false;
					options.shareEl = false;
					options.bgOpacity = 0.85;
					options.tapToClose = true;
					options.tapToToggleControls = false;
				}
				break;
			}
		}

		if(disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

		// see: http://photoswipe.com/documentation/responsive-images.html
		var realViewportWidth,
			useLargeImages = false,
			firstResize = true,
			imageSrcWillChange;

		gallery.listen('beforeResize', function() {

			var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
			dpiRatio = Math.min(dpiRatio, 2.5);
			realViewportWidth = gallery.viewportSize.x * dpiRatio;


			if(realViewportWidth >= 1200 || (/*!gallery.likelyTouchDevice &&*/ realViewportWidth > 800) || screen.width > 1200 ) {
				if(!useLargeImages) {
					useLargeImages = true;
					imageSrcWillChange = true;
				}
				
			} else {
				if(useLargeImages) {
					useLargeImages = false;
					imageSrcWillChange = true;
				}
			}

			if(imageSrcWillChange && !firstResize) {
				gallery.invalidateCurrItems();
			}

			if(firstResize) {
				firstResize = false;
			}

			imageSrcWillChange = false;

		});

		gallery.listen('gettingData', function(index, item) {
			if( useLargeImages ) {
				item.src = item.o.src;
				item.w = item.o.w;
				item.h = item.o.h;
			} else {
				item.src = item.m.src;
				item.w = item.m.w;
				item.h = item.m.h;
			}
		});

		gallery.init();
	};

	// select all gallery elements
	var galleryElements = document.querySelectorAll( gallerySelector );
	for(var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if(hashData.pid && hashData.gid) {
		openPhotoSwipe( hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true );
	}
};

initPhotoSwipeFromDOM('#product-images');