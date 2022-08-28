<?php
ini_set("soap.wsdl_cache_enabled", "0");
error_reporting(0);
if($_POST['ajax']=='true'){
include_once('marjan/db_config.php');
$page=$_POST['page'];
$field1=$_POST['field1'];
$field2=$_POST['field2'];
$field3=$_POST['field3'];
$field4=$_POST['field4'];
if($_POST['in']=='5ld' && $field1==''){exit;}
$browser = $_SERVER['HTTP_USER_AGENT'];
if(!empty($_SERVER['HTTP_CLIENT_IP'])){$ip = $_SERVER['HTTP_CLIENT_IP'];}elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];}else{$ip = $_SERVER['REMOTE_ADDR'];}
mysqli_query($db_connection,"INSERT INTO `form`(`ip`,`browser`,`datetime`,`page`,`field1`,`field2`,`field3`,`field4`) VALUE('$ip','$browser','$datetime','$page','$field1','$field2','$field3','$field4')");
$smsconfigsql=mysqli_query($db_connection,"SELECT * FROM `variable` WHERE `type`='sms'");
while($smsconfigrow=mysqli_fetch_assoc($smsconfigsql)){$smsconfig[$smsconfigrow['name']]=$smsconfigrow['value'];}
sendMessage($smsconfig['smsuser'],$smsconfig['smspass'],$smsconfig['smsfrom'],$smsconfig['smsadminphone'],smscompiler($smsconfig['smsadmintext']));
sendMessage($smsconfig['smsuser'],$smsconfig['smspass'],$smsconfig['smsfrom'],$field1,smscompiler($smsconfig['smstext']));
}
function sendMessage($smsuser,$smspass,$smsfrom,$smsphone,$smstext){
$sms_client = new SoapClient('http://api.payamak-panel.com/post/send.asmx?wsdl', array('encoding'=>'UTF-8'));
$parameters['username'] = $smsuser;
$parameters['password'] = $smspass;
$parameters['to'] = $smsphone;
$parameters['from'] = $smsfrom;
$parameters['text'] =$smstext;
$parameters['isflash'] =false;
echo $sms_client->SendSimpleSMS2($parameters)->SendSimpleSMS2Result;
}
function smscompiler($string){
global $field1,$field2,$field3,$field4,$datetime;
$string=str_replace('{mjfield1}',$field1,$string);
$string=str_replace('{mjfield2}',$field2,$string);
$string=str_replace('{mjfield3}',$field3,$string);
$string=str_replace('{mjfield4}',$field4,$string);
$string=str_replace('{datetime}',$datetime,$string);
return $string;
}
?>