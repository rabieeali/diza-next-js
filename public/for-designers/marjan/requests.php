<?php
error_reporting(0);
include_once('functions.php');
include_once('db_config.php');
$action=$_POST['action'];
if($action=='addpage'){
$page=mysqli_real_escape_string($db_connection,$_POST['page']);
$title=mysqli_real_escape_string($db_connection,$_POST['title']);
$description=mysqli_real_escape_string($db_connection,$_POST['description']);
$content=mysqli_real_escape_string($db_connection,$_POST['content']);
$url=mysqli_real_escape_string($db_connection,$_POST['url']);
$template=mysqli_real_escape_string($db_connection,$_POST['template']);
$checkexis=mysqli_query($db_connection,"SELECT `id` FROM `pages` WHERE `url`='$url' OR `page`='$page' LIMIT 1");
if(mysqli_num_rows($checkexis)==1){echo 'error';exit;}
mysqli_query($db_connection,"INSERT INTO `pages`(`title`,`description`,`content`,`url`,`template`) VALUES('$title','$description','$content','$url','$template')");
$lastid=mysqli_insert_id($db_connection);
mysqli_query($db_connection,"UPDATE `pages` SET `page`='$lastid' WHERE `id`='$lastid'");
}elseif($action=='addfield'){
$page=trim(mysqli_real_escape_string($db_connection,$_POST['page']));
$name=trim(mysqli_real_escape_string($db_connection,$_POST['name']));
$type=$untype=trim(mysqli_real_escape_string($db_connection,$_POST['type']));
$loop=trim(mysqli_real_escape_string($db_connection,$_POST['loop']));
$loopparent=trim(mysqli_real_escape_string($db_connection,$_POST['loopparent']));
if($page=='' && $loopparent!=''){
$page=looppagefromid($loopparent);
}
$group=trim(mysqli_real_escape_string($db_connection,$_POST['group']));
$checkexis=mysqli_query($db_connection,"SELECT `name` FROM `fields` WHERE `name`='$name' AND `page`='$page' LIMIT 1");
if(mysqli_num_rows($checkexis)==1){echo 'error';exit;}
if($page!='allpages'){
$allc=mysqli_query($db_connection,"SELECT `name` FROM `fields` WHERE `loop`='$loopparent' AND `page`='$page'");
$allcd=mysqli_query($db_connection,"SELECT distinct `name` FROM `fields` WHERE `loop`='$loopparent' AND `page`='$page'");
$iallfields=mysqli_num_rows($allc)/mysqli_num_rows($allcd);
if($iallfields==0 || is_nan($iallfields)==1){$iallfields=1;}
$loopid='';
if($type=='loop'){mysqli_query($db_connection,"INSERT INTO `loop`(`name`,`parent`,`page`) VALUES('$name','$loop','$page')");$loopid=mysqli_insert_id($db_connection);}
for($i=0;$i<$iallfields;$i++){mysqli_query($db_connection,"INSERT INTO `fields`(`name`,`type`,`page`,`parent`,`loop`,`loopparent`) VALUES('$name','$type','$page','$group','$loopid','$loopparent')");}
$lastid=mysqli_insert_id($db_connection);
if($group==''){$group='بدون گروه';}
$type=pageType($type);
//if($untype=='loop' && $loop!=''){$type=$type.' (زیرمجموعه '.pagenamefromid($loop).')';}
if($untype=='loop'){$type='<a class="gotoloop" href="?loop='.$loopid.'">'.$type.'</a>';}
echo '<tr class="collapse-'.$lastid.'" data-id="'.$lastid.'"><td>'.$name.'</td><td>'.$type.'</td><td>'.$group.'</td><td>'.pagenamefromid($page).'</td><td><div class="collapse-icon"></div><div class="collapse"><a class="edit" href="addpage.php?edit='.$page.'">صفحه</a><a class="delete">حذف</a></div></td></tr>';
}else{
$allpagesql=mysqli_query($db_connection,"SELECT `title`,`page` FROM `pages`");
while($allpagerow=mysqli_fetch_assoc($allpagesql)){
$pagename=$allpagerow['page'];
$pagetitle=$allpagerow['title'];
$allc=mysqli_query($db_connection,"SELECT `name` FROM `fields` WHERE `loop`='$loopparent' AND `page`='$page'");
$allcd=mysqli_query($db_connection,"SELECT distinct `name` FROM `fields` WHERE `loop`='$loopparent' AND `page`='$page'");
$iallfields=mysqli_num_rows($allc)/mysqli_num_rows($allcd);
if($iallfields==0 || is_nan($iallfields)==1){$iallfields=1;}
$loopid='';
if($type=='loop'){mysqli_query($db_connection,"INSERT INTO `loop`(`name`,`parent`,`page`) VALUES('$name','$loop','$pagename')");$loopid=mysqli_insert_id($db_connection);}
for($i=0;$i<$iallfields;$i++){mysqli_query($db_connection,"INSERT INTO `fields`(`name`,`type`,`page`,`parent`,`loop`,`loopparent`) VALUES('$name','$type','$pagename','$group','$loopid','$loopparent')");}
$lastid=mysqli_insert_id($db_connection);
if($group==''){$group='بدون گروه';}
$type=pageType($type);
//if($untype=='loop' && $loop!=''){$type=$type.' (زیرمجموعه '.pagenamefromid(($loop).')';}
if($untype=='loop'){$type='<a class="gotoloop" href="?loop='.$loopid.'">'.$type.'</a>';}
echo '<tr class="collapse-'.$lastid.'" data-id="'.$lastid.'"><td>'.$name.'</td><td>'.$type.'</td><td>'.$group.'</td><td>'.$pagetitle.'</td><td><div class="collapse-icon"></div><div class="collapse"><a class="edit" href="addpage.php?edit='.$pagename.'">صفحه</a><a class="delete">حذف</a></div></td></tr>';
}
}
}elseif($action=='editsms'){
$smsuser=mysqli_real_escape_string($db_connection,$_POST['smsuser']);
$smspass=mysqli_real_escape_string($db_connection,$_POST['smspass']);
$smsfrom=mysqli_real_escape_string($db_connection,$_POST['smsfrom']);
$smsadminphone=mysqli_real_escape_string($db_connection,$_POST['smsadminphone']);
$smsadmintext=mysqli_real_escape_string($db_connection,$_POST['smsadmintext']);
$smstext=mysqli_real_escape_string($db_connection,$_POST['smstext']);
mysqli_query($db_connection,"UPDATE `variable` SET `value`='$smsuser' WHERE `name`='smsuser'");
mysqli_query($db_connection,"UPDATE `variable` SET `value`='$smspass' WHERE `name`='smspass'");
mysqli_query($db_connection,"UPDATE `variable` SET `value`='$smsfrom' WHERE `name`='smsfrom'");
mysqli_query($db_connection,"UPDATE `variable` SET `value`='$smsadminphone' WHERE `name`='smsadminphone'");
mysqli_query($db_connection,"UPDATE `variable` SET `value`='$smsadmintext' WHERE `name`='smsadmintext'");
mysqli_query($db_connection,"UPDATE `variable` SET `value`='$smstext' WHERE `name`='smstext'");
}elseif($action=='editfield'){
$id=mysqli_real_escape_string($db_connection,$_POST['id']);
$page=mysqli_real_escape_string($db_connection,$_POST['page']);
$name=trim(mysqli_real_escape_string($db_connection,$_POST['name']));
$value=trim(mysqli_real_escape_string($db_connection,$_POST['value']));
$pastvalue=trim(mysqli_real_escape_string($db_connection,$_POST['pastvalue']));
$checkexis=mysqli_query($db_connection,"SELECT `name` FROM `fields` WHERE `$name`='$value' AND `page`='$page' AND `id`!='$id' LIMIT 1");
if(mysqli_num_rows($checkexis)==1){echo 'error';exit;}
mysqli_query($db_connection,"UPDATE `fields` SET `$name`='$value' WHERE `$name`='$pastvalue' AND `page`='$page'");
mysqli_query($db_connection,"UPDATE `fields` SET `loop`='$value' WHERE `loop`='$pastvalue'");
}elseif($action=='copypage'){
$url=trim(mysqli_real_escape_string($db_connection,$_POST['url']));
$copypage=mysqli_real_escape_string($db_connection,$_POST['copypage']);
$checkexis=mysqli_query($db_connection,"SELECT `id` FROM `pages` WHERE `url`='$url' LIMIT 1");
if(mysqli_num_rows($checkexis)==1){echo 'error';exit;}
copypage($copypage,$url);
//mysqli_query($db_connection,"INSERT INTO `pages`(`title`,`description`,`content`,`template`,`url`,`page`) SELECT `title`,`description`,`content`,`template`,'$url','$page' FROM `pages` WHERE `page` = '$copypage'");
//$lastid=mysqli_insert_id($db_connection);
//mysqli_query($db_connection,"UPDATE `pages` SET `page`='$lastid' WHERE `id`='$lastid'");
//mysqli_query($db_connection,"INSERT INTO `fields`(`name`,`value`,`type`,`parent`,`loop`,`page`) SELECT `name`,`value`,`type`,`parent`,`loop`,'$lastid' FROM `fields` WHERE `page` = '$copypage'");
//mysqli_query($db_connection,"INSERT INTO `loop`(`name`,`parent`,`page`) SELECT `name`,`parent`,'$lastid' FROM `loop` WHERE `page`='$copypage'");
}elseif($action=='editpage'){
$page=mysqli_real_escape_string($db_connection,$_POST['page']);
$title=mysqli_real_escape_string($db_connection,$_POST['title']);
$description=mysqli_real_escape_string($db_connection,$_POST['description']);
$content=mysqli_real_escape_string($db_connection,$_POST['content']);
$url=mysqli_real_escape_string($db_connection,$_POST['url']);
$template=mysqli_real_escape_string($db_connection,$_POST['template']);
$fields=$_POST['fields'];
$checkexis=mysqli_query($db_connection,"SELECT `id` FROM `pages` WHERE `url`='$url' AND `page`!='$page' LIMIT 1");
if(mysqli_num_rows($checkexis)==1){echo 'error';exit;}
foreach($fields as $field){
$fieldid=trim($field[0]);
$fieldvalue=trim($field[1]);
mysqli_query($db_connection,"UPDATE `fields` SET `value`='$fieldvalue' WHERE `id`='$fieldid' AND `page`='$page'");
}
mysqli_query($db_connection,"UPDATE `pages` SET `title`='$title',`description`='$description',`content`='$content',`url`='$url',`template`='$template' WHERE `page`='$page'");
}elseif($action=='delete'){
$id=$_POST['id'];
$tbl=$_POST['tbl'];
if($tbl=='pages'){
$pagefromid=mysqli_query($db_connection,"SELECT `page` FROM `pages` WHERE `id`='$id'");
$pagefromid=mysqli_fetch_assoc($pagefromid);
$pagefromid=$pagefromid['page'];
mysqli_query($db_connection,"DELETE FROM `fields` WHERE `page`='$pagefromid'");
mysqli_query($db_connection,"DELETE FROM `loop` WHERE `page`='$pagefromid'");
}elseif($tbl=='fields'){
$loopfromid=mysqli_query($db_connection,"SELECT `name`,`type`,`loop`,`page` FROM `fields` WHERE `id`='$id'");
$loopfromidRow=mysqli_fetch_assoc($loopfromid);
$loopfromid=$loopfromidRow['loop'];
$loopfromidType=$loopfromidRow['type'];
$loopfromidLoop=$loopfromidRow['loop'];
$loopfromidPage=$loopfromidRow['page'];
if($loopfromidLoop!=''){
mysqli_query($db_connection,"DELETE FROM `loop` WHERE `id`='$loopfromid'");
deleteloopfields($loopfromid);
//mysqli_query($db_connection,"DELETE FROM `fields` WHERE `loop`='$loopfromidLoop' AND `name`='$loopfromid' AND `page`='$loopfromidPage'");
}
}
mysqli_query($db_connection,"DELETE FROM `$tbl` WHERE `id`='$id'");
}elseif($action=='delwhile'){
$page=$_POST['page'];
$fields=$_POST['fields'];
$loops=$_POST['loops'];
foreach($fields as $field){
$fieldid=trim($field[0]);
$fieldvalue=trim($field[1]);
mysqli_query($db_connection,"DELETE FROM `fields` WHERE `id`='$fieldid' AND `page`='$page'");
}
foreach($loops as $loop){
$loopid=trim($loop[0]);
$loopvalue=trim($loop[1]);
$getloopid=mysqli_query($db_connection,"SELECT `loop` FROM `fields` WHERE `id`='$loopid'");
$getloopid=mysqli_fetch_assoc($getloopid);
$getloopid=$getloopid['loop'];
mysqli_query($db_connection,"DELETE FROM `fields` WHERE `id`='$loopid' AND `page`='$page'");
mysqli_query($db_connection,"DELETE FROM `loop` WHERE `id`='$getloopid'");
}
}elseif($action=='newwhile'){
//echo loopfields($_POST['name'],$_POST['page']);
$id=$_POST['id'];
$page=$_POST['page'];
$fieldsql=mysqli_query($db_connection,"SELECT * FROM `fields` WHERE `loopparent`='$id' AND `page`='$page' GROUP BY `name` ORDER BY `id` ASC");
$num=1;
$allc=mysqli_query($db_connection,"SELECT distinct `name` FROM `fields` WHERE `loopparent`='$id' AND `page`='$page'");
$allc=mysqli_num_rows($allc);
while($row=mysqli_fetch_assoc($fieldsql)){
if(fmod($num-1,$allc)==0){echo '<div class="while">';}
$rowid=$row['id'];
$rowname=$row['name'];
$rowtype=$row['type'];
$rowpage=$row['page'];
$rowparent=$row['parent'];
$rowloop=$row['loop'];
$rowloopparent=$row['loopparent'];
if($rowtype=='loop' && $rowloop!=''){
$lastid=copytheloop($rowid);
}else{
mysqli_query($db_connection,"INSERT INTO `fields`(`name`,`type`,`page`,`parent`,`loop`,`loopparent`) VALUES('$rowname','$rowtype','$rowpage','$rowparent','$rowloop','$rowloopparent')");
$lastid=mysqli_insert_id($db_connection);
}
$newfieldsql=mysqli_query($db_connection,"SELECT * FROM `fields` WHERE `id`='$lastid' LIMIT 1");
$newrow=mysqli_fetch_assoc($newfieldsql);
echo settingfield($newrow,$lastid);
if(fmod($num+$allc,$allc)==0){echo '<div class="delwhile"><span></span></div></div>';}
$num++;
}
}elseif($action=='formshow'){
$id=$_POST['id'];
$sql=mysqli_query($db_connection,"SELECT * FROM `form` WHERE `id`='$id' LIMIT 1");
$row=mysqli_fetch_assoc($sql);
if($row['field1']!=''){echo $row['field1'].'<br/>';}
if($row['field2']!=''){echo $row['field2'].'<br/>';}
if($row['field3']!=''){echo $row['field3'].'<br/>';}
if($row['field4']!=''){echo $row['field4'].'<br/>';}
}elseif($action=='' && $_GET['upload']=='true'){
if($_FILES['file']['name'] != ''){
$directory = '../images/';
if(!is_dir($directory) && !mkdir($directory)){echo 'error';exit;}
if(($_FILES['file']['size'] >= 5097152) || ($_FILES["file"]["size"] == 0)){echo 'error';exit;}
$exbase = explode('.', $_FILES['file']['name']);
$extension = end($exbase);
$name=str_replace(' ','-',$exbase[0]).'-'.time().'.'.$extension;
$location=$directory.$name;
move_uploaded_file($_FILES['file']['tmp_name'], $location);
echo $name;
}
}
?>