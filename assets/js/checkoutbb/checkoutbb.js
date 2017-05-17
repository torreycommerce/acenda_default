var checkout = checkout || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
	'use strict';
	new checkout.CheckoutView();
});


$('#summary-panel').stick_in_parent();