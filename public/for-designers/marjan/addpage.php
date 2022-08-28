<?php
error_reporting(0);
$location='صفحه جدید';
$editpage=$_GET['edit'];
if($editpage!=''){
$location='ویرایش صفحه';
include_once('db_config.php');
$editpage=mysqli_real_escape_string($db_connection,$editpage);
$pagesql=mysqli_query($db_connection,"SELECT * FROM `pages` WHERE `page`='$editpage'");
$pagerow=mysqli_fetch_assoc($pagesql);
}
include_once('header.php');
?>
<div class="container">
<div class="grouptabclear"></div>
<div class="group group-default active">
<label for="Mtitle">عنوان صفحه:<code>&#x3C;?php mj('title'); ?&#x3E;</code></label>
<input type="text" id="Mtitle" value="<?php echo $pagerow['title'];?>" placeholder="عنوان صفحه">
<label for="Mdescription">تعریف صفحه:<code>&#x3C;?php mj('description'); ?&#x3E;</code></label>
<input type="text" id="Mdescription" value="<?php echo $pagerow['description'];?>" placeholder="تعریف صفحه">
<label for="Murl">آدرس صفحه:</label>
<input type="text" id="Murl" value="<?php echo $pagerow['url'];?>" placeholder="آدرس صفحه">
<label for="Mtemplate">قالب:</label>
<input type="text" id="Mtemplate" value="<?php echo $pagerow['template'];?>" placeholder="قالب">
<?php if($editpage!=''){ ?>
<input type="hidden" id="Mpage" value="<?php echo $pagerow['page'];?>" >
<?php }else{?><?php } ?>
<label for="Mcontent">محتوای صفحه:<code>&#x3C;?php mj('content'); ?&#x3E;</code></label>
<textarea id="Mcontent" placeholder="محتوای صفحه"><?php echo $pagerow['content'];?></textarea>
</div>
<?php
$groupssql=mysqli_query($db_connection,"SELECT distinct `parent` FROM `fields` WHERE `page`='$editpage'");
$grouptab.='<a class="active" data-group="default">بدون گروه</a>';
while($groupsrow=mysqli_fetch_assoc($groupssql)){
$groupparentdb=$groupsrow['parent'];
$groupparent=clearvar($groupsrow['parent']);
if($groupparent==''){
$query="SELECT * FROM `fields` WHERE `page`='$editpage' AND `parent`='' AND `loopparent`='' AND `type`!='group'";
$groupparent='default active';
}else{
$query="SELECT * FROM `fields` WHERE `page`='$editpage' AND `parent`='$groupparentdb' AND `loopparent`=''";
$grouptab.='<a data-group="'.clearvar($groupsrow['parent']).'">'.$groupsrow['parent'].'</a>';
}
$fieldsql=mysqli_query($db_connection,$query);
echo '<div class="group group-'.$groupparent.'">';
while($fieldrow=mysqli_fetch_assoc($fieldsql)){
echo settingfield($fieldrow);
}
echo '</div>';
}
?>
<?php if($editpage!=''){ ?><div class="btn" id="submit_editpage">بروزرسانی</div><?php }else{ ?><div class="btn" id="submit_addpage">ثبت صفحه</div><?php } ?>
<?php
if($grouptab!=''){
echo '<div class="grouptab noselect">'.$grouptab.'</div>';
}
?>
</div>
<?php
$script="$(function(){
$('.grouptabclear').height($('.grouptab').height()+10);
$('.grouptab').addClass('active');
});";
include_once('footer.php');
?>