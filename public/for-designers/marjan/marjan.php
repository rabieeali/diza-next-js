<?php
error_reporting(0);
include_once('marjan/db_config.php');
$page=$_GET['page'];
$pagesql=mysqli_query($db_connection,"SELECT * FROM `pages` WHERE `url`='$page' LIMIT 1");
$pagerow=mysqli_fetch_assoc($pagesql);
$pageid=$pagerow['page'];
if(mysqli_num_rows($pagesql)==0){redirect('404');}
$pagename=$pagerow['page'];
$fieldsql=mysqli_query($db_connection,"SELECT `name`,`value`,`type` FROM `fields` WHERE `page`='$pagename'");	 	
while($fieldrow=mysqli_fetch_assoc($fieldsql)){
$fieldValue=$fieldrow['value'];
if($fieldrow['type']=='image'){$fieldValue='images/'.$fieldValue;}
if($fieldrow['type']=='paragraph'){$fieldValue=nl2br($fieldValue);}
$field[$fieldrow['name']]=$fieldValue;
}
function mj($string,$echo='false'){
global $pagerow,$field;
$return=nl2br($pagerow[$string]);
if($return==''){
$return=$field[$string];
}
if($echo=='false'){echo $return;}elseif($echo=='true'){return $return;}
}
function mjloop($loop,$parentrow=''){
global $db_connection,$pageid;
$query="SELECT `id` FROM `loop` WHERE `name`='$loop' AND `page`='$pageid'";
if($parentrow!=''){
$parentid=$parentrow['id'];
$query="SELECT `id` FROM `loop` WHERE `parent`='$parentid' AND `page`='$pageid'";
}
$loopSql=mysqli_query($db_connection,$query);
//echo '>'.$loop.mysqli_num_rows($loopSql).'<br>';
$arrNum=0;
while($loopRow=mysqli_fetch_assoc($loopSql)){
$loopidfromname=$loopRow['id'];
$sql=mysqli_query($db_connection,"SELECT * FROM `fields` WHERE `loopparent`='$loopidfromname' ORDER BY `id` ASC");
$num=1;
//echo mysqli_num_rows($sql).'+';
$allc=mysqli_query($db_connection,"SELECT distinct `name` FROM `fields` WHERE `loopparent`='$loopidfromname'");
$allc=mysqli_num_rows($allc);
while($row=mysqli_fetch_assoc($sql)){
if(fmod($num-1,$allc)==0){$arrNum++;}
$rowValue=$row['value'];
if($row['type']=='image'){$rowValue='images/'.$rowValue;}
$return[$arrNum][$row['name']]=$rowValue;
$return[$arrNum]['id']=$loopidfromname;
$return[$arrNum]['uniqid']=$row['loop'];
$num++;
}
$arrNum++;
}
//echo var_dump($return[1]);
return $return;
}
function redirect($url){
if(!headers_sent()){  
header('Location: '.$url);exit;
}else{                 
echo '<script type="text/javascript">';
echo 'window.location.href="'.$url.'";';
echo '</script>';
echo '<noscript>';
echo '<meta http-equiv="refresh" content="0;url='.$url.'" />';
echo '</noscript>'; exit;
}
}
function spliter($string,$tag='span'){
$chars = str_split($string);
$return='';
foreach($chars as $char){
$return.='<'.$tag.'>'.$char.'</'.$tag.'>';
}
return $return;
}
function mjcount($table,$colmn='',$value='',$parent='',$type=''){
global $db_connection;

if($colmn!='' && $value!=''){
$query="SELECT `id` FROM `$table` WHERE `$colmn`='$value'";
}
$sql=mysqli_query($db_connection,$query);
if($parent==true){
$row=mysqli_fetch_assoc($sql);
$rowid=$row['id'];
$sql=mysqli_query($db_connection,"SELECT `id` FROM `fields` WHERE `loopparent`='$rowid' AND `type`='$type'");
}
return mysqli_num_rows($sql);
}
?>