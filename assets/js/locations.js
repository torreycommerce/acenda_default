function acendaMaps() {
/* global */
if ($('#search-locs').length) {
	var input = document.getElementById('search-locs');
	var searchBox = new google.maps.places.SearchBox(input);
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		if (places.length == 0) {
			return;
		}
	});
	//
	$('.btn-search-locs').click(function(){
		if ($('.input-search-locs').val() !== "") {
			window.location.href = acendaBaseUrl+'/stores/map?location='+$('#search-locs').val()+'&radius='+locDefaultRadius;
		}
	});
}

/* */


/* stores/map */
if ($('.stores-map').length) {
	initStoresMap();
}
/* */


/* stores/store/map */
if ($('.stores-store-map').length) {
	initStoresStoreMap();
}
/* */
}