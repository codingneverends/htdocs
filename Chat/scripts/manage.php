<?php
$_origin="localhost";
$username="root";
$password="";
$databasename="chat";
$db=new mysqli($_origin,$username,$password,$databasename);
if($db->connect_error){
    die("Connection failure : " .$db->connect_error);
}
$result=array();

$finresult=array();


$sql="SELECT * FROM `update_details`";
$result=$db->query($sql);
//echo($result);
if($result){
    $i=0;
    while($row=mysqli_fetch_assoc($result)){
        $finresult[$i]['timestamp']=$row['timestamp'];
        $finresult[$i]['name']=$row['name'];
        $i++;
    }
}


$db->close();
header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
echo json_encode($finresult);
?>