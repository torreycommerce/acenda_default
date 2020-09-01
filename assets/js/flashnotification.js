jQuery(function(){
    $.getJSON(acendaBaseUrl+'/flashnotification/getjson', function(data) {
      if(data.length) {
        var css_alert_types = ['success','error','info'];
        $.each(data, function(key, item) {
          setCustomerNotification(item.type,item.message,item.id);
        });
      }
    });
});

setCustomerNotification = function(type,message,id) {
  var css_alert_types = ['success','error','info'];
  var bs_class = type;
  if($.inArray(type, css_alert_types) == -1) bs_class = 'info';
  var notifier = $("<div />",{
    'class':'alert alert-'+bs_class+' flash-note flash-note-'+type,
    'style':'display:none;',
    'id':'flash-note-' + id
  });
  var btn = $("<button />",{
    'type':'button',
    'class':'close',
    'data-dismiss':'alert',
	'aria-label':'close alert'
  });
  btn.html('<span aria-hidden="true">&times;</span>');
  if(type == 'confirm') {
    notifier.addClass('flash-note-confirm');
    btn.attr('data-flashid',id);
    var confirmBtn = btn.clone();
    confirmBtn.attr('class','btn btn-info');
    confirmBtn.html('Okay');
    btn.add(confirmBtn).click(function(){
      $.post(acendaBaseUrl+'/flashnotification/confirmnotification',{'id':$(this).attr('data-flashid')});
    });
  }

  notifier.append('<div class="modal-header"><div class="h3 modal-title">Attention!</div>'+btn+'</div>');
  notifier.append('<div class="modal-body">'+message+'</div>');
  notifier.append(confirmBtn);
  $('.flash-note').last().append(notifier);

  if(type == 'confirm' || type == 'error') {
    notifier.fadeIn();
  } else {
    notifier.fadeIn().delay(5000).fadeOut();
  }
}