<?php
error_reporting(0);
$location='راهنما';
include_once('header.php');
include_once('db_config.php');
?>
<div class="container help">
<p>مرجان، سیستم مدیریت محتوای اختصاصی کافه لید میباشد که سبک و سریع بودن دو مزیت مهم این سیستم است.</p>
<p>شما از نسخه آزمایشی مرجان استفاده میکنید.</p>
<p>برای شروع و بعد از اطمینان از موجود بودن پوشه مرجان، برای پیکربندی کد زیر را ابتدای صفحه مورد نظر قرار دهید:</p>
<code>&#x3C;?php<br>$mjtemplate='landing';<br>include_once('marjan/marjan.php');<br>?&#x3E;</code>
<p class="pt-10">و برای فراخانی فیلد مورد نظر باید به روش زیر عمل کنید:</p>
<code>&#x3C;?php mj('field'); ?&#x3E;</code>
<p class="pt-10">فیلد های اولیه و پیشفرض هر صفحه:</p>
<code>&#x3C;?php<br>mj('title');<br>mj('description');<br>mj('content');<br>?&#x3E;</code>
<p class="pt-10">نمونه کد فرم:</p>
<code>&#x3C;form&#x3E;<br/>&#x3C;input type="text" class="mjfield1"&#x3E; <--PhoneField<br/>&#x3C;input type="text" class="mjfield2"&#x3E;<br/>&#x3C;input type="text" class="mjfield3"&#x3E;<br/>&#x3C;input type="text" class="mjfield4"&#x3E;<br/>&#x3C;input type="button" class="mjsubmit"&#x3E;<br/>&#x3C;/form&#x3E;<br/>&#x3C;script src="mjform.js"&#x3E;&#x3C;/script&#x3E;</code>
<p class="pt-10">تمامی حقوق مرجان برای کافه لید محفوظ میباشد.</p>
</div>
<?php include_once('footer.php'); ?>