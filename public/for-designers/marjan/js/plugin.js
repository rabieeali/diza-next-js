$(document).on('mouseenter','.haveul',function(){
var aul=$(this).data('aul');
$(this).addClass('active');
$('.aul-'+aul).addClass('active');
});
$(document).on('mouseleave','.aul',function(){
if($(this).hasClass('superactive')){return false;}
$('.menu.active').removeClass('active');
});
$(document).on('click','#submit_addpage',function(){
var Mpage=$('#Mpage').val();
var Mtitle=$('#Mtitle').val();
var Mdescription=$('#Mdescription').val();
var Mcontent=$('#Mcontent').val();
var Murl=$('#Murl').val();
var Mtemplate=$('#Mtemplate').val();
var btn=$(this);
var returnerr='false';
if(Mpage==''){$('#Mpage').addClass('error');returnerr='true';setTimeout(function(){$('#Mpage').removeClass('error');},1000);}
if(Mtitle==''){$('#Mtitle').addClass('error');returnerr='true';setTimeout(function(){$('#Mtitle').removeClass('error');},1000);}
if(Mtemplate==''){$('#Mtemplate').addClass('error');returnerr='true';setTimeout(function(){$('#Mtemplate').removeClass('error');},1000);}
if(returnerr=='true'){return false;}
$.ajax({url:'requests.php',type:'post',data:{'action':'addpage','title':Mtitle,'description':Mdescription,'content':Mcontent,'url':Murl,'template':Mtemplate},success:function(data){
if(data=='error'){
btn.addClass('faild');
setTimeout(function(){btn.removeClass('faild');},1000);
return false;
}
btn.addClass('success');
setTimeout(function(){window.location.replace('pages.php');},1000);
}});
});
function copyToClipboard(string) {
var aux = document.createElement("input");
aux.setAttribute("value", string);
document.body.appendChild(aux);
aux.select();
document.execCommand("copy");
document.body.removeChild(aux);
}
$(document).on('click','label code',function(){
var elm=$(this);
var copyboard=elm.html();
copyboard=copyboard.replace('&lt;?php','<?php');
copyboard=copyboard.replace('?&gt;','?>');
copyToClipboard(copyboard);
elm.addClass('success');
setTimeout(function(){elm.removeClass('success');},500);
});
var c='mar';
$(document).on('dblclick','.editable',function(){
var elm=$(this);
var editableHtml=elm.html();
var editableName=elm.data('name');
var editablePastvalue=elm.data('pastvalue');
var editableId=elm.parent().data('id');
var editablePage=elm.parent().data('page');
if(elm.hasClass('active')){
var editableValue=elm.find('input').val();
$.ajax({url:'requests.php',type:'post',data:{'action':'editfield','id':editableId,'name':editableName,'value':editableValue,'pastvalue':editablePastvalue,'page':editablePage},success:function(data){
if(data=='error'){return false;}
elm.html(editableValue);
elm.removeClass('active');
}});
return false;
}
$(this).html('<input type="text" value="'+editableHtml+'">').addClass('active');
});
$(document).on('click','#submit_addfield',function(){
var Fname=$('#Fname').val();
var Ftype=$('#Ftype').val();
var Fpage=$('#Fpage').val();
var Fgroup=$('#Fgroup').val();
var Floop=$('#Floop').val();
var Floopparent=$('#Floopparent').val();
var btn=$(this);
var returnerr='false';
if(!Fpage && Floopparent==''){$('#Fpage').addClass('error');returnerr='true';setTimeout(function(){$('#Fpage').removeClass('error');},1000);}
if(!Ftype){$('#Ftype').addClass('error');returnerr='true';setTimeout(function(){$('#Ftype').removeClass('error');},1000);}
if(Fname==''){$('#Fname').addClass('error');returnerr='true';setTimeout(function(){$('#Fname').removeClass('error');},1000);}
if(returnerr=='true'){return false;}
$.ajax({url:'requests.php',type:'post',data:{'action':'addfield','page':Fpage,'group':Fgroup,'name':Fname,'type':Ftype,'loop':Floop,'loopparent':Floopparent},success:function(data){
if(data=='error'){
$('#Fname').addClass('error');
setTimeout(function(){$('#Fname').removeClass('error');},1000);
return false;
}
btn.addClass('success');
setTimeout(function(){
$('#Fname').val('');
$('#Ftype').find('option:eq(0)').prop('selected', true);
$('table tbody tr:nth-last-child(1)').before(data);
if(Ftype=='loop'){
$("#Floop").append(new Option('زیرمجموعه '+Fname,Fname));
}
btn.removeClass('success');
},1000);
}});
});
$(document).on('click','#submit_copypage',function(){
var Curl=$('#Curl').val();
var Ccopypage=$('#Ccopypage').val();
var btn=$(this);
$.ajax({url:'requests.php',type:'post',data:{'action':'copypage','url':Curl,'copypage':Ccopypage},success:function(data){
if(data=='error'){
btn.addClass('faild');
setTimeout(function(){btn.removeClass('faild');},1000);
return false;
}
btn.addClass('success');
setTimeout(function(){window.location.replace('pages.php');},1000);
}});
});
$('#Ftype').on('change',function(){
var elm=$(this).parent();
var optionvalue=$(this).val();
if(optionvalue=='loop'){
elm.addClass('loop');
}else{elm.removeClass('loop');}
});
$(document).on('click','#submit_editsms',function(){
var smsuser=$('#smsuser').val();
var smspass=$('#smspass').val();
var smsfrom=$('#smsfrom').val();
var smsadminphone=$('#smsadminphone').val();
var smsadmintext=$('#smsadmintext').val();
var smstext=$('#smstext').val();
var btn=$(this);
$.ajax({url:'requests.php',type:'post',data:{'action':'editsms','smsuser':smsuser,'smspass':smspass,'smsfrom':smsfrom,'smsadminphone':smsadminphone,'smsadmintext':smsadmintext,'smstext':smstext},success:function(data){
btn.addClass('success');
setTimeout(function(){btn.removeClass('success');},1000);
}});
});
$(document).on('click','#submit_editpage',function(){
var Mpage=$('#Mpage').val();
var Mtitle=$('#Mtitle').val();
var Mdescription=$('#Mdescription').val();
var Mcontent=$('#Mcontent').val();
var Murl=$('#Murl').val();
var Mtemplate=$('#Mtemplate').val();
var fields=[];
$('.fieldinput').each(function(){
var fieldvalue=$(this).val();
var fieldid=$(this).data('id');
fields.push([fieldid,fieldvalue]);
});
var btn=$(this);
var returnerr='false';
if(Mpage==''){$('#Mpage').addClass('error');returnerr='true';setTimeout(function(){$('#Mpage').removeClass('error');},1000);}
if(Mtitle==''){$('#Mtitle').addClass('error');returnerr='true';setTimeout(function(){$('#Mtitle').removeClass('error');},1000);}
if(Mtemplate==''){$('#Mtemplate').addClass('error');returnerr='true';setTimeout(function(){$('#Mtemplate').removeClass('error');},1000);}
if(returnerr=='true'){return false;}
$.ajax({url:'requests.php',type:'post',data:{'action':'editpage','page':Mpage,'title':Mtitle,'description':Mdescription,'content':Mcontent,'url':Murl,'template':Mtemplate,'fields':fields},success:function(data){
if(data=='error'){
btn.addClass('faild');
setTimeout(function(){btn.removeClass('faild');},1000);
return false;
}
btn.addClass('success');
setTimeout(function(){btn.removeClass('success');},1000);
}});
});
$(document).on('click','.collapse-icon',function(){
var dataid=$(this).parent().parent().data('id');
$('table tr:not(.collapse-'+dataid+')').removeClass('active');
$('table .collapse-'+dataid).toggleClass('active');
});
$(document).on('click','.pages .delete',function(){
var dataid=$(this).parent().parent().parent().data('id');
if($(this).html()=='حذف'){
$(this).html('مطمئنم');
}else{
$.ajax({url:'requests.php',type:'post',data:{'action':'delete','tbl':'pages','id':dataid}});
$(this).parent().parent().parent().fadeOut();
}
});
$(document).on('click','.setting .delete',function(){
var dataid=$(this).parent().parent().parent().data('id');
if($(this).html()=='حذف'){
$(this).html('مطمئنم');
}else{
$.ajax({url:'requests.php',type:'post',data:{'action':'delete','tbl':'fields','id':dataid}});
$(this).parent().parent().parent().fadeOut();
}
});
$(document).on('click','.dropbox .deleteimg',function(){
prnt=$(this).parent().parent();
prnt.removeClass('have');
prnt.find('.dropbox-input').val('');
});
$(document).on('click','.dropbox .editimg',function(){
prnt=$(this).parent().parent();
prnt.find('.uploadstation').click();
});
$(document).on('click','.dropbox .uploadstation',function(){
$(this).parent().find('.dropbox-file').click();
});
$(document).on('change','.dropbox-file',function(){
//var property = document.getElementById('dropbox-input').files[0];
var thismis=$(this).parent();
var thiselement=thismis;
var property = thismis.find('.dropbox-file')[0].files[0];
var image_name = property.name;
var image_extension = image_name.split('.').pop().toLowerCase();
if(jQuery.inArray(image_extension,['svg','png','jpg','jpeg','gif','']) == -1){
return false;
}
thiselement.addClass('progressing-alt');
var form_data = new FormData();
form_data.append("file",property);
$.ajax({
url:'requests.php?upload=true',
method:'POST',
data:form_data,
contentType:false,
cache:false,
processData:false,
success:function(data){
console.log(data);
thiselement.removeClass('progressing-alt');
if(data=='error'){
thiselement.removeClass('success error');
thiselement.addClass('error');
}else{
thiselement.removeClass('success error');
thiselement.addClass('success');
thismis.find('.dropbox-input').val(data);
setTimeout(function(){thiselement.addClass('have');thiselement.removeClass('success');thiselement.find('img').attr('src','../images/'+data);},1000);
}
}
});
});
$(document).on('click','.logininput .btn',function(e){
var loginuser=$('#loginuser').val();
var loginpassword=$('#loginpassword').val();
if(!$('.logininput').hasClass('passwordstation')){
if(loginuser==''){return false;}
$('.logininput .btn').addClass('next');
setTimeout(function(){$('.logininput .btn').removeClass('next');},1500);
$('.logininput').addClass('passwordstation');
$('#loginpassword').focus();
return false;
}
if(loginpassword.length<3){return false;}
if($('#loginpassword').hasClass('spammer'))
$('#loginpassword').prop('disabled', true);
$.ajax({url:'login.php?log='+c+'insec',method:"POST",data:{'loginuser':loginuser,'loginpassword':loginpassword},success:function(result){
if(result=='succ'){$('.logininput').addClass('success');setTimeout(function(){location.href='../marjan/';},1500);}else{if(result=='spammer'){$('#loginuser,#loginpassword').val('').prop('disabled', true);$('#loginuser').val('!!شما مسدود شده اید');$('.logininput').addClass('spammer');return false;}$('#loginpassword').addClass('error');setTimeout(function(){$('#loginpassword').prop('disabled', false).val('').removeClass('error');},1500);}
}});
});
$(document).on('click','.newwhile span',function(e){
var whileid=$(this).parent().data('id');
var whilepage=$(this).parent().data('page');
var elm=$(this).parent().parent();
$.ajax({url:'requests.php',type:'post',data:{'action':'newwhile','id':whileid,'page':whilepage},success:function(data){elm.children('.newwhile').before(data);}});
});
$('#loginuser,#loginpassword').keypress(function(event){
if(event.keyCode == 13){
$('.logininput .btn').click();
}
});
$(document).on('click','.delwhile span',function(e){
var elm=$(this).parent().parent();
var Mpage=$('#Mpage').val();
var looplength=elm.parent().children('.while').length;
if(looplength==1){return false;}
var fields=[];
var loops=[];
elm.find('.fieldinput').each(function(){
var fieldvalue=$(this).val();
var fieldid=$(this).data('id');
fields.push([fieldid,fieldvalue]);
});
elm.find('.looplabel').each(function(){
var loopsvalue=$(this).data('name');
var loopsid=$(this).data('id');
loops.push([loopsid,loopsvalue]);
});
$.ajax({url:'requests.php',type:'post',data:{'action':'delwhile','page':Mpage,'fields':fields,'loops':loops},success:function(data){
elm.fadeOut(300,function(){$(this).remove();});
}});
});
$(document).on('click','.formshow',function(e){
var dataid=$(this).parent().data('id');
$.ajax({url:'requests.php',type:'post',data:{'action':'formshow','id':dataid},success:function(data){
$('body').addClass('formshow-active');
$('.formshowfull .container').html(data);
}});
});
$(document).on('click','.formshow-active .formshowfull',function(e){
$('body').removeClass('formshow-active');
});
$(document).on('click','.grouptab a',function(e){
var group=$(this).data('group');
$('.group,.grouptab a').removeClass('active');
$(this).addClass('active');
$('.group.group-'+group).addClass('active');
});