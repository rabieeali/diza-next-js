<?php
define('DB_NAME', 'cafelead_padna');
define('DB_HOST','localhost');
define('DB_USER', 'cafelead_padna');
define('DB_PASS', ')!oxt^@nIXvH');
$db_connection = mysqli_connect(DB_HOST,DB_USER,DB_PASS,DB_NAME)or die('could not connect to database');
mysqli_set_charset($db_connection,'utf8');
date_default_timezone_set('Asia/Tehran');
$datetime=date('Y-m-d H:i:s');
?>