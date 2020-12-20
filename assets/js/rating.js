$(document).ready(function() {
    $('body').on('mouseenter focusin','.star-rating-star',function(){
        var r = $(this).attr('data-i');
        $('.star-rating-star').each(function(){
            if ($(this).attr('data-i') <= r) {
                $(this).addClass('choosing');
            } else {
                $(this).removeClass('choosing');
            }
        });
    });
    //
    $('body').on('mouseleave focusout','.star-rating-star',function(){
        $('.star-rating-star').removeClass('choosing');
    });
    //
    $('.star-rating-star').click(function() {
        var r = $(this).attr('data-i');
        $('.star-rating-star').each(function(){
            if ($(this).attr('data-i') <= r) {
                $(this).addClass('chosen');
            } else {
                $(this).removeClass('chosen');
            }
        });
        $(this).parents('.star-rating').find('input').val(r/5);
    });
});
