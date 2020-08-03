$(document).on('click','.btn-qv', function() {
	var QVrecalc = 0;
	if (!$('.modal-qv').length) {
		$('#content').append('<div class="modal modal-qv fade" tabindex="-1" role="dialog" aria-labelledby="'+$(this).attr('id')+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="h3 modal-title">'+$(this).text()+'</div><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button></div><div class="modal-body quick-view"></div></div></div></div>');
		QVrecalc = 1;
	}
	//
	if ($('.modal-qv').attr('aria-labelledby') != $(this).attr('id')) {
		$('.quick-view').html('<div class="py-4 text-center"><i class="fa fa-3x fa-spinner fa-pulse"></i></div>');
		$('.modal-qv').attr('aria-labelledby',$(this).attr('id'));
		$('.modal-qv .modal-title').text($(this).text());
		QVrecalc = 1;
	}
	//
	if (QVrecalc) {
		$.get(acendaBaseUrl + '/product/'+$(this).data('slug'), function(data) {
			$('.quick-view').html(data);
			cartIsReadyYet = 0;
			$('.modal-qv').modal('show');
			ajaxCart("{}", true);
		});
	} else {
		$('.modal-qv').modal('show');
	}
});

$('.modal-qv').on('show.bs.modal', function () {
	if ($('.slick-heroic.slick-heroic-go').length) {
		productSlick();
	}
});