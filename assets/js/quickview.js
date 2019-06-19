$(document).on('click','.btn-qv', function() {
	var QVrecalc = 0;
	if (!$('#modalQV').length) {
		$('#content').append('<div class="modal fade" id="modalQV" tabindex="-1" role="dialog" aria-labelledby="'+$(this).attr('id')+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="container"><div class="h3 modal-title">'+$(this).text()+'</div><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button></div></div><div class="modal-body"><div class="container quick-view"></div></div></div></div></div>');
		QVrecalc = 1;
	}
	//
	if ($('#modalQV').attr('aria-labelledby') != $(this).attr('id')) {
		$('.quick-view').html('<div class="max-250"><div class="py-4 text-center"><i class="fa fa-3x fa-spinner fa-pulse"></i></div></div>');
		$('#modalQV').attr('aria-labelledby',$(this).attr('id'));
		$('#modalQV .modal-title').text($(this).text());
		QVrecalc = 1;
	}
	//
	if (QVrecalc) {
		$.get(acendaBaseUrl + '/product/'+$(this).data('slug'), function(data) {
			console.log('got it');
			$('.quick-view').html(data);
			$('#modalQV').modal('show');
			ajaxCart("{}", true);
		});
	} else {
		$('#modalQV').modal('show');
	}
});

$('#modalQV').on('show.bs.modal', function () {
	if ($('.slick-heroic.slick-heroic-go').length) {
		productSlick();
	}
});