<?php
error_reporting(0);
$location='صفحات';
include_once('header.php');
include_once('db_config.php');
if($_GET['copy']!=''){
$page=$_GET['copy'];
$pagesql=mysqli_query($db_connection,"SELECT `page` FROM `pages` WHERE `page`='$page' LIMIT 1");
$pageexis=mysqli_num_rows($pagesql);
}
if($_GET['copy']!='' && $pageexis==1){
?>
<div class="container copy">
<p>شما اقدام به کپی صفحه <?php echo pagenamefromid($_GET['copy']); ?> کردید، بعد اتمام عملیات تمامی فیلد های صفحه نیز در قالب صفحه ای جدید به شما ارائه داده میشود.</p>
<input type="text" id="Curl" placeholder="آدرس صفحه">
<input type="hidden" id="Ccopypage" value="<?php echo $_GET['copy'];?>">
<div class="btn" id="submit_copypage">کپی صفحه</div>
</div>
<?php
}else{
?>
<div class="container pages">
<table class="table" cellspacing="0" cellpadding="0">
<thead>
<tr>
<td>عنوان</td>
<td>تعریف</td>
<td>آدرس</td>
<td><div class="collapse-icon"></div></td>
</tr>
</thead>
<tbody>
<?php
$pageSql=mysqli_query($db_connection,"SELECT * FROM `pages` ORDER BY `id` DESC");
while($pageRow=mysqli_fetch_assoc($pageSql)){
$pageRowUrl=$pageRow['url'];
if($pageRowUrl==''){$pageRowUrl='صفحه نخست';}
echo '<tr class="collapse-'.$pageRow['id'].'" data-id="'.$pageRow['id'].'"><td><a href="addpage.php?edit='.$pageRow['page'].'">'.$pageRow['title'].'</a></td><td>'.$pageRow['description'].'</td><td><a href="../'.$pageRow['url'].'">'.$pageRowUrl.'</a></td><td><div class="collapse-icon"></div><div class="collapse lg"><a class="edit" href="addpage.php?edit='.$pageRow['page'].'">ویرایش</a><a href="pages.php?copy='.$pageRow['page'].'" class="copy">کپی</a><a class="delete">حذف</a></div></td></tr>';
}
?>
</tbody>
</table>
</div>
<?php } include_once('footer.php'); ?>