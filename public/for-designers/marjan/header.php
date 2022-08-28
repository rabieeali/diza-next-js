<?php
session_start();
error_reporting(0);
include_once('functions.php');
if($_SESSION['adminlogin']!='true'){redirect('login.php');exit;}
$title='Marjan Management';
if($location!=''){$title=$location.' | '.$title;}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title><?php echo $title;?></title>
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
<div id="background"></div>
<div id="rightside">
<div class="logo">
<div class="toggleside"></div>
</div>
<div class="menu">
<a href="index.php"<?php if($location=='داشبورد'){echo ' class="superactive"';}?>><div class="icon"></div><span>داشبورد</span></a>
<a class="haveul<?php if($location=='صفحات' || $location=='صفحه جدید'){echo ' superactive';}?>" data-aul="pages" href="pages.php"><div class="icon"></div><span>صفحات</span></a>
<div class="aul aul-pages<?php if($location=='صفحه جدید' || $location=='صفحات' || $location=='ویرایش صفحه'){echo ' superactive';}?>">
<a href="addpage.php"<?php if($location=='صفحه جدید' || $location=='ویرایش صفحه'){echo ' class="superactive"';}?>><div class="icon"></div><span>صفحه جدید</span></a>
<a href="pages.php"<?php if($location=='صفحات'){echo ' class="superactive"';}?>><div class="icon"></div><span>تمامی صفحات</span></a>
</div>
<a href="form.php"<?php if($location=='فرم'){echo ' class="superactive"';}?>><div class="icon"></div><span>فرم</span></a>
<a href="setting.php"<?php if($location=='تنظیمات'){echo ' class="superactive"';}?>><div class="icon"></div><span>تنظیمات</span></a>
<a href="help.php"<?php if($location=='راهنما'){echo ' class="superactive"';}?>><div class="icon"></div><span>راهنما</span></a>
</div>
</div>
<div id="area">
<div id="nav">
<div class="search">
<div class="icon icon-search"></div>
<input type="text" placeholder="جستجو...">
</div>
<div class="navright">
<div class="avatar">C</div>
<a href="logout.php" class="logout"></a>
</div>
</div>
<div class="container">
<h3 class="noselect"><?php echo $location;?></h3>