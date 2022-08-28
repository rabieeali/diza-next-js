<?php
error_reporting(0);
$location='فرم';
include_once('header.php');
include_once('db_config.php');
$smsconfigsql=mysqli_query($db_connection,"SELECT * FROM `variable` WHERE `type`='sms'");
while($smsconfigrow=mysqli_fetch_assoc($smsconfigsql)){$smsconfig[$smsconfigrow['name']]=$smsconfigrow['value'];}
?>
<div class="container pages">
<div class="mb-2">
<div class="row">
<div class="col">
<label for="smsuser">نام کاربری پنل:</label>
<input type="text" id="smsuser" value="<?php echo $smsconfig['smsuser'];?>" placeholder="نام کاربری پنل">
</div>
<div class="col">
<label for="smspass">رمز عبور پنل:</label>
<input type="text" id="smspass" value="<?php echo $smsconfig['smspass'];?>" placeholder="رمز عبور پنل">
</div>
</div>
<div class="row">
<div class="col">
<label for="smsfrom">خط ارسال کننده:</label>
<input type="text" id="smsfrom" value="<?php echo $smsconfig['smsfrom'];?>" placeholder="خط ارسال کننده">
</div>
<div class="col"> 
<label for="smsadminphone">شماره تلفن مدیر:</label>
<input type="text" id="smsadminphone" value="<?php echo $smsconfig['smsadminphone'];?>" placeholder="شماره تلفن مدیر">
</div>
</div>
<div class="row">
<div class="col">
<label for="smsadmintext">متن برای مدیر:</label>
<textarea id="smsadmintext" placeholder="متن برای مدیر"><?php echo $smsconfig['smsadmintext'];?></textarea>
</div>
<div class="col">
<label for="smstext">متن برای کاربر:</label>
<textarea id="smstext" placeholder="متن برای کاربر"><?php echo $smsconfig['smstext'];?></textarea>
</div>
</div>
<p class="sowrote">پ.ن: با استفاده از {datetime},{mjfield1},{mjfield2},{mjfield3},{mjfield4} میتوانید فیلد مورد نظر خود را در پیامک نمایش دهید.</p>
<div class="btn" id="submit_editsms">بروزرسانی</div>
</div>
<table class="table" cellspacing="0" cellpadding="0">
<thead>
<tr>
<td>موبایل</td>
<td>آیپی</td>
<td>تاریخ ارسال</td>
<td>صفحه</td>
</tr>
</thead>
<tbody>
<?php
$pageSql=mysqli_query($db_connection,"SELECT * FROM `form` ORDER BY `id` DESC");
while($pageRow=mysqli_fetch_assoc($pageSql)){
echo '<tr class="collapse-'.$pageRow['id'].'" data-id="'.$pageRow['id'].'"><td class="formshow">'.$pageRow['field1'].'</td><td>'.$pageRow['ip'].'</td><td>'.timeAgo($pageRow['datetime']).'</td><td>'.$pageRow['page'].'</td></tr>';
}
?>
</tbody>
</table>
</div>
<?php include_once('footer.php'); ?>