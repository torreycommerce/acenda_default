(function($){
    initVideoPlayer();
}( window.jQuery ));

function youtubeUrlToId (url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11){
        return match[7];
    } else {
        return false;
    }
}

function vimeoUrlToId (url) {
    var regExp = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    var match = url.match(regExp);
    if (match){
        if (match[3]){
            return match[3];
        }else{
            return false
        }
    } else {
        return false;
    }
}

function initVideoPlayer(b){
    $("[data-video-src]").each(function() {
        var url = $(this).attr("data-video-src");
        var el = $(this);
        var title = 'Video Title';
        var thumbnail = '';

        if(id = youtubeUrlToId(url)) {
			if(b) {
				player = new YT.Player('main-product-video', {
					width: '100%',
					height: '300',
					playerVars: { 'rel': 0, 'showinfo': 0 }
				});
			} else {
				window.onYouTubePlayerAPIReady = function() {
					player = new YT.Player('main-product-video', {
						width: '100%',
						height: '300',
						playerVars: { 'rel': 0, 'showinfo': 0 }
					});
				};
			}
            el.find('img').first().attr('src', '//img.youtube.com/vi/'+id+'/default.jpg');
            el.click(function() {
                    $('#image-main').addClass('active');
                    //
                    player.loadVideoById(id);
            });
        }
        else if (id = vimeoUrlToId(url)) {
            var url_info = "https://vimeo.com/api/v2/video/"+id+".json";
            $.get( url_info, function( data ) {
                el.find('img').first().attr('src', data[0].thumbnail_medium);
            });
            el.click(function() {
                    $('#image-main').addClass('active');
                    //
                    $('#main-product-video').html('<iframe src="//player.vimeo.com/video/'+id+'?autoplay=true" width="100%" height="300" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen autoplay></iframe>');
            });
        }
    });
}

function stopVideo(){
    $('#image-main').removeClass('active');
    //
    if(player){
        player.stopVideo();
    }else{
        $('.main-product-video').html('');
    }     
}

$(document).click(function(e) {
    if (e.target.id != 'image-main' && !$('#image-main').find(e.target).length && !$('.vari-video-scase').find(e.target).length) {
        if ($('#image-main').hasClass('active')) {
            stopVideo();
        }
    }
});