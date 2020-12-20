var aceDRimgI; // img to rotate
var aceDRimgD; // img to rotate, default img
var aceDRarrI = [];
var aceDRimg2 = new Image();
//
var aceDRloopC;
var aceDRloopM = 2; // max imgs to show. 2 only.
var aceDRloopS;
//
var aceDRtog;
var aceDRhov; // is it currently hovered?

aceDRimg2.onload = function() {
	//console.log('onload ran v9, loop: '+aceDRloopC);
	if (aceDRhov && !aceDRtog) {
		aceDRtog = setInterval(function(){ Ani() }, 1000);
		Ani();
	}
}

$('body').on('mouseenter focusin','.product a',function(){
	if ($('html').hasClass('desktop') && $(this).find('[data-rot]').length && !aceDRtog) {
		aceDRhov = 1;
		aceDRimgI = $(this).find('[data-rot]');
		aceDRimgD = aceDRimgI.attr('src');

		aceDRarrI = aceDRimgI.data('rot');
		aceDRarrI = aceDRarrI.split(',');
		aceDRloopS = aceDRarrI.length;
		aceDRloopC = 1;

		aceDRimg2.src = aceDRarrI[aceDRloopC];
	}
});

$('body').on('mouseleave focusout','.product a',function(){
	if ($('html').hasClass('desktop') && $(this).find('[data-rot]').length) {
		aceDRhov = 0;
		//console.log('mouseout focusout ran')
		stopAni();
	}
});

function Ani() {
	$(aceDRimgI).attr('src',aceDRarrI[aceDRloopC]);
	//
	aceDRloopC++;
	if ((aceDRloopC == aceDRloopS) || (aceDRloopC == aceDRloopM)) {
		aceDRloopC = 0;
	}
}

function stopAni() {
	clearInterval(aceDRtog);
	aceDRtog = null;
	$(aceDRimgI).attr('src',aceDRimgD);
}