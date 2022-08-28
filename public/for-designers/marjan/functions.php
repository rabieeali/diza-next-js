<?php
include_once('db_config.php');
function multilang($en,$fa){
global $lang;
if($lang=='fa'){return $fa;}else{return $en;}
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
function timeago($datetime, $full = false){
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'سال',
        'm' => 'ماه',
        'w' => 'هفته',
        'd' => 'روز',
        'h' => 'ساعت',
        'i' => 'دقیقه',
        's' => 'ثانیه',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? '' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' پیش' : 'لحظاتی پیش';
}
function clearvar($string){
$string=str_replace(' ','-',$string);
$string=str_replace('?','',$string);
$string=str_replace('؟','',$string);
$string=str_replace(')','',$string);
$string=str_replace('(','',$string);
return $string;
}
function pageType($string){
if($string=='image'){$string='تصویر';}
if($string=='textbox'){$string='متن کوتاه';}
if($string=='paragraph'){$string='متن بلند';}
if($string=='loop'){$string='تکرارشونده';}
return $string;
}
function spancoller($string){
$arr=explode(" ",$string);
$stringplus='';
foreach($arr as $v){$stringplus.='<span>'.$v.'</span>';}
return $stringplus;
}
function settingfield($fieldrow,$id=''){
$fieldrowId=$fieldrow['id'];
if($id!=''){$fieldrowId=$id;}
if($fieldrow['type']=='textbox' || $fieldrow['type']=='image' || $fieldrow['type']=='paragraph'){echo '<div class="fieldcol">';}
if($fieldrow['type']=='loop'){$labelClass=' class="flex-100 looplabel" data-id="'.$fieldrow['id'].'" data-name="'.$fieldrow['name'].'"';}
echo '<label for="field'.$fieldrowId.'"'.$labelClass.'>'.$fieldrow['name'].':';
if($fieldrow['type']=='loop'){echo '<code>&#x3C;?php foreach(mjloop('."'".$fieldrow['name']."'".') as $row){ //fields } ?&#x3E;</code>';}elseif($fieldrow['loop']==''){echo '<code>&#x3C;?php mj('."'".$fieldrow['name']."'".'); ?&#x3E;</code>';}else{echo '<code>&#x3C;?php $row['."'".$fieldrow['name']."'".']; ?&#x3E;</code>';}
echo '</label>';
if($fieldrow['type']=='image'){
if($fieldrow['value']==''){$imageexist='';}else{$imageexist=' have';}
echo '<div class="dropbox'.$imageexist.'"><div class="uploadedimage noselect"><a class="editimg"></a><a class="deleteimg"></a><img src="../images/'.$fieldrow['value'].'" draggable="false"></div><div id="field'.$fieldrowId.'" class="uploadstation">آپلود تصویر</div><input type="file" class="dropbox-file" accept="image/*"><input type="hidden" value="'.$fieldrow['value'].'" class="fieldinput dropbox-input" data-id="'.$fieldrow['id'].'"></div>';
}elseif($fieldrow['type']=='textbox'){
echo '<input type="text" id="field'.$fieldrowId.'" value="'.$fieldrow['value'].'" class="fieldinput" data-id="'.$fieldrow['id'].'" placeholder="'.$fieldrow['name'].'">';
}elseif($fieldrow['type']=='paragraph'){
echo '<textarea class="fieldinput" data-id="'.$fieldrow['id'].'" placeholder="'.$fieldrow['name'].'">'.$fieldrow['value'].'</textarea>';
}elseif($fieldrow['type']=='loop'){
echo '<div class="havewhile">';
echo loopfields($fieldrow['loop'],$fieldrow['page']);
echo '</div>';
}
if($fieldrow['type']=='textbox' || $fieldrow['type']=='image' || $fieldrow['type']=='paragraph'){echo '</div>';}
}
function loopfields($loopid,$page){
global $db_connection;
$fieldsql=mysqli_query($db_connection,"SELECT * FROM `fields` WHERE `loopparent`='$loopid' AND `page`='$page' ORDER BY `id` ASC");
$num=1;
$allc=mysqli_query($db_connection,"SELECT distinct `name` FROM `fields` WHERE `loopparent`='$loopid' AND `page`='$page'");
$allc=mysqli_num_rows($allc);
while($row=mysqli_fetch_assoc($fieldsql)){
if(fmod($num-1,$allc)==0){echo '<div class="while">';}
echo settingfield($row);
//echo $row['id'].' ';
if(fmod($num+$allc,$allc)==0){echo '<div class="delwhile"><span></span></div></div>';}
$num++;
}
echo '<div class="newwhile" data-id="'.$loopid.'" data-page="'.$page.'"><span></span></div>';
}
function pagenamefromid($id){
global $db_connection;
$sql=mysqli_query($db_connection,"SELECT `title` FROM `pages` WHERE `id`='$id'");
$row=mysqli_fetch_assoc($sql);
return $row['title'];
}
function loopnamefromid($id){
global $db_connection;
$sql=mysqli_query($db_connection,"SELECT `name` FROM `loop` WHERE `id`='$id'");
$row=mysqli_fetch_assoc($sql);
return $row['name'];
}
function looppagefromid($id){
global $db_connection;
$sql=mysqli_query($db_connection,"SELECT `page` FROM `loop` WHERE `id`='$id'");
$row=mysqli_fetch_assoc($sql);
return $row['page'];
}
function deleteloopfields($id){
global $db_connection;
$sql=mysqli_query($db_connection,"SELECT `id`,`loop`,`type` FROM `fields` WHERE `loopparent`='$id'");
while($row=mysqli_fetch_assoc($sql)){
$fieldid=$row['id'];
$loopid=$row['loop'];
if($row['type']=='loop'){mysqli_query($db_connection,"DELETE FROM `loop` WHERE `id`='$loopid'");deleteloopfields($row['loop']);}
mysqli_query($db_connection,"DELETE FROM `fields` WHERE `id`='$fieldid'");
}
}
function copypage($oldpageid,$newurl){
global $db_connection;
mysqli_query($db_connection,"INSERT INTO `pages`(`title`,`description`,`content`,`template`,`url`,`page`) SELECT `title`,`description`,`content`,`template`,'$newurl','' FROM `pages` WHERE `page`='$oldpageid'");
$newpageid=$lastid=mysqli_insert_id($db_connection);
mysqli_query($db_connection,"UPDATE `pages` SET `page`='$lastid' WHERE `id`='$lastid'");
$sql_loop=mysqli_query($db_connection,"SELECT * FROM `loop` WHERE `page`='$oldpageid' AND `parent`=''");
$sql_field=mysqli_query($db_connection,"SELECT * FROM `fields` WHERE `page`='$oldpageid' AND `loopparent`=''");
while($rowfield=mysqli_fetch_assoc($sql_field)){
$rowname=$rowfield['name'];
$rowvalue=$rowfield['value'];
$rowtype=$rowfield['type'];
$rowparent=$rowfield['parent'];
mysqli_query($db_connection,"INSERT INTO `fields`(`name`,`value`,`type`,`page`,`parent`,`loop`,`loopparent`) VALUE('$rowname','$rowvalue','$rowtype','$newpageid','$rowparent','','')");
}
while($row=mysqli_fetch_assoc($sql_loop)){
copytheloop($row['id'],'',$newpageid);
//echo $row['id'].'>';
//echo '>';
//echo $newpageid.'>';
//echo $oldpageid.'<br>';
}
mysqli_query($db_connection,"DELETE FROM `loop` WHERE `page`='$newpageid' AND `name`=''");
mysqli_query($db_connection,"DELETE FROM `fields` WHERE `page`='$newpageid' AND ((`name`='') OR (`type`='loop' AND `loop`=''))");
}
function copytheloop($id,$parpar='',$parpage='',$loopinloop='false'){
global $db_connection;
$query="SELECT * FROM `fields` WHERE `id`='$id'";
if($parpage!='' && $loopinloop=='false'){$query="SELECT * FROM `fields` WHERE `loop`='$id' ORDER BY `id` ASC LIMIT 1";}
$sql=mysqli_query($db_connection,$query);
$row=mysqli_fetch_assoc($sql);
//if(mysqli_num_rows($sql)==0){continue;}
//echo mysqli_num_rows($sql);
$loopname=$row['name'];
$loopvalue='';
$loopparent=$row['loopparent'];
$looppage=$row['page'];
$rowid=$row['id'];
$rowname=$row['name'];
$rowtype=$row['type'];
$rowpage=$row['page'];
if($parpage!=''){$looppage=$parpage;$rowpage=$parpage;}
$rowparent=$row['parent'];
$rowloop=$row['loop'];
$rowloopparent=$row['loopparent'];
if($parpar!=''){$loopparent=$parpar;$rowloopparent=$parpar;$loopvalue=$row['value'];}
mysqli_query($db_connection,"INSERT INTO `loop`(`name`,`parent`,`page`) VALUE('$loopname','$loopparent','$looppage')");
$loopid=mysqli_insert_id($db_connection);
mysqli_query($db_connection,"INSERT INTO `fields`(`name`,`value`,`type`,`page`,`parent`,`loop`,`loopparent`) VALUE('$rowname','$loopvalue','$rowtype','$rowpage','$rowparent','$loopid','$rowloopparent')");
$mainfieldid=mysqli_insert_id($db_connection);
$innerQuery="SELECT * FROM `fields` WHERE `loopparent`='$rowloop'";
//if($oldpageid!=''){$innerQuery="SELECT * FROM `fields` WHERE `loopparent`='$rowloop' AND `page`='$oldpageid'";}
$innerSql=mysqli_query($db_connection,$innerQuery);
while($innerRow=mysqli_fetch_assoc($innerSql)){
$innerRowid=$innerRow['id'];
$innerRowname=$innerRow['name'];
$innerRowtype=$innerRow['type'];
$innerRowpage=$innerRow['page'];
$innerRowvalue=$innerRow['value'];
if($parpage!=''){$innerRowpage=$parpage;}
$innerRowparent=$innerRow['parent'];
if($innerRowtype=='loop'){
copytheloop($innerRowid,$loopid,$parpage,'true');
}else{
mysqli_query($db_connection,"INSERT INTO `fields`(`name`,`value`,`type`,`page`,`parent`,`loop`,`loopparent`)
VALUE('$innerRowname','$innerRowvalue','$innerRowtype','$innerRowpage','$innerRowparent','','$loopid')");
}
}
return $mainfieldid;
}
?>