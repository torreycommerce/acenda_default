function acendaMaps() {
/* global */
if ($('#search-store').length) {
	var input = document.getElementById('search-store');
	var searchBox = new google.maps.places.SearchBox(input);
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();
		if (places.length == 0) {
			return;
		}
	});
	//
	$('.btn-search-store').click(function(){
		if ($('.input-search-store').val() !== "") {
			window.location.href = acendaBaseUrl+'/stores/map?location='+$('#search-store').val()+'&radius='+locDefaultRadius;
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