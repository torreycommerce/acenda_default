var imgToRot;
var myAni;
//
var imgToReturn;
var img2 = new Image();
//

img2.onload = function() {
	//console.log('onload ran 3')
	myAni = setInterval(function(){ Ani() }, 1000);
	Ani();
}

$('body').on('mouseenter focusin','.product a',function(e){
	if ($('html').hasClass('desktop') && $(this).find('[data-rot]').length && !myAni) {
		imgToReturn = $(this).find('[data-rot]').attr('src');
		imgToRot = $(this).find('[data-rot]');

		iArr = imgToRot.data('rot');
		iArr = iArr.split(',');
		loopSize = iArr.length;
		loopCount = 1;
		loopMax = 2;

		img2.src = iArr[loopCount];
	}
});

$('body').on('mouseleave focusout','.product a',function(e){
	if ($('html').hasClass('desktop') && $(this).find('[data-rot]').length) {
		//console.log('mouseout focusout ran')
		stopAni();
	}
});

function Ani() {
	$(imgToRot).attr('src',iArr[loopCount]);
	//
	loopCount++;
	if ((loopCount == loopSize) || (loopCount == loopMax)) {
		loopCount = 0;
	}
}

function stopAni() {
	clearInterval(myAni);
	myAni = null;
	$(imgToRot).attr('src',imgToReturn);
}