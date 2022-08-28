var requestUrl='https://diza.gallery/:api:restful/lead';

$(document).on('click','.megamenu a',function(){
	let index=$(this).index()+1;
	$('body').addClass('megaup');
	$('body').removeClass('wellcome');
	
	if($('.content-'+index).hasClass('active')){
	$('.content').removeClass('active');
	$('body').addClass('wellcome');
	$('body').removeClass('megaup');
	$('.wallpaper,.wallpaper-responsive').removeClass('wallpaper-1 wallpaper-2 wallpaper-3 wallpaper-4');
	$('.megamenu a').removeClass('active');
	}else{
	$('.content').removeClass('active');
	$('.content-'+index).addClass('active');
	$('.wallpaper,.wallpaper-responsive').removeClass('wallpaper-1 wallpaper-2 wallpaper-3 wallpaper-4');
	$('.wallpaper,.wallpaper-responsive').addClass('wallpaper-'+index);
	$('.megamenu a').removeClass('active');
	$(this).addClass('active')
	}
});

$(document).on('click','.backer',function(){
	$('body').addClass('wellcome');
	$('body').removeClass('megaup');
});

$(document).on('click','.form .btn',function(){
    let name=$('.name').val();
    let phone=$('.phone').val();
    let description=$('.description').val();
    if(name=='' || phone=='' || $('.form .btn').hasClass('disabled')){$('.form').addClass('error');setTimeout(function(){$('.form').removeClass('error');},1000);return false;}
    $('.form .btn').addClass('disabled');
    $.ajax({
    url:requestUrl,
    method: "POST",
    data: {
        'name':name,
        'phone':phone,
        'description':description
    },
    success: function (result) {
        $('.name,.phone,.description').attr('disabled',true);
        $('.form').addClass('success');
    }
    });
});