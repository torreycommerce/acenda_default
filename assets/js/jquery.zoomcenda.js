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
//
//
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