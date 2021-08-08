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

//Admin page -- which will create all tables
//Just opn and run admin page

$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    if($act=="init"){
        $sql="CREATE TABLE `users` ( username VARCHAR(20) UNIQUE )";
        $finresult=$db->query($sql);
        $sql="CREATE TABLE `qns` (id INTEGER , question VARCHAR(20) , answer VARCHAR(5) )";
        $finresult=$db->query($sql);
        $sql="CREATE TABLE `qnlogs` (id INTEGER , username VARCHAR(20), question VARCHAR(20) , answer VARCHAR(5) ,youranswer VARCHAR(5))";
        $finresult=$db->query($sql);
    }
    if($act=="add"){
        $qn=$_POST["question"];
        $ans=$_POST["answer"];
        $id=$_POST["id"];
        $sql="INSERT INTO `qns` (id,question,answer) VALUES($id,'".$qn."','".$ans."')";
        $result=$db->query($sql);
    }
    if($act=="getstatus"){
        $sql="SELECT * FROM `users`";
        $result=$db->query($sql);
        if(!$result)
            $finresult=false;
        else{
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row['username'];
                $i++;
            }
        }
    }
}
$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
echo json_encode($finresult);

?>