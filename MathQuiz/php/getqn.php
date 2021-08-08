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

//Status will be set for all operation

$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    //Get Qn from databse
    if($act=="getqn"){
        $id=$_POST['id'];
        $sql="SELECT * FROM `qns` WHERE `id`=$id";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult['question']=$data['question'];
        $finresult['answer']=$data['answer'];
        $finresult['id']=$data['id'];
    }
    //Add user log to database
    if($act=="tolog"){
        $id=$_POST['id'];
        $qn=$_POST['question'];
        $ans=$_POST['answer'];
        $name=$_POST['name'];
        $yans=$_POST['youranswer'];
        $sql="INSERT INTO `qnlogs` (id,username,question,answer,youranswer) VALUES ($id,'".$name."','".$qn."','".$ans."','".$yans."')";
        $finresult=$db->query($sql);
    }
    //Extract specific users log
    if($act=="getlog"){
        $name=$_POST['name'];
        $sql="SELECT * FROM `qnlogs` WHERE username='".$name."'";
        $finresult=false;
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]['question']=$row['question'];
                $finresult[$i]['answer']=$row['answer'];
                $finresult[$i]['youranswer']=$row['youranswer'];
                $i++;
            }
        }
    }
    //Clear specific users log
    if($act=="clearlog"){
        $name=$_POST['name'];
        $sql="DELETE FROM `qnlogs` WHERE username='".$name."'";
        $finresult=$db->query($sql);
    }
}
$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
echo json_encode($finresult);

?>