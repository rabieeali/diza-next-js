$(document).ready(function(){
var requestUrl='https://diza.gallery/:api:restful/lead';
  $("#join").click(function(){
    $("body").addClass('myup');
    $("body").removeClass('menu-open');
  });
  $("#join2").click(function(){
    $("body").addClass('mydown');
  });
  $(".zarbdar").click(function(){
    $("body").removeClass('mydown myup');
  });
  $(".responsive-menu").click(function(){
    $("body").toggleClass('menu-open');
    $("body").removeClass('myup');

  });
  $(document).on('click','.open-menu .item',function(){$("body").removeClass('menu-open');
  });
  $(document).on('click','.darkhst .send',function(){
      let name=$('.formname').val();
      let phone=$('.formphone').val();
      if(name=='' || phone=='' || $('.darkhast .send').hasClass('disabled')){return false;}
      $.ajax({
        url:requestUrl,
        method: "POST",
        data: {
            'name':name,
            'phone':phone
        },
        success: function (result) {
            $('.formname,.formphone').attr('disabled',true);
            $('.darkhst').addClass('success');
            $('.darkhst .send').addClass('disabled');
        }
    });

	
  });
});
