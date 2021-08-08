<?php
$_origin="localhost";
$username="root";
$password="";
$databasename="mathquiz";
$db=new mysqli($_origin,$username,$password,$databasename);
if($db->connect_error){
    die("Connection failure : " .$db->connect_error);
}
$result=array();

$finresult=array();

//Logs users in

$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    $name=$_POST['username'];
    if($act=="login"){
        $sql="SELECT COUNT(*) AS `count` FROM `users` WHERE `username`='".$name."'";
        $finresult=false;
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        if($data['count']==0){
            $sql="INSERT INTO `users` ( `username` ) VALUES('".$name."')";
            $finresult=$db->query($sql);
            $finresult=true;
        }
    }
}
$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
echo json_encode($finresult);

?>