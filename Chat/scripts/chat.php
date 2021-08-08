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


$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    if($act=='get')
    {
        $sql="SELECT * FROM `chat`";
        $result=$db->query($sql);
        //echo($result);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]['time']=$row['time'];
                $finresult[$i]['key']=$row['key'];
                $finresult[$i]['message']=$row['message'];
                $finresult[$i]['sender']=$row['sender'];
                $i++;
            }
        }
    }
    else if($act=='add'){
        $sql="SELECT * FROM `chat`";
        $result=$db->query($sql);
        $index=0;
        $sender=$_POST['sender'];
        $message=$_POST['message'];
        //echo($result);
        if($result){
            $i=0;
            $t_set=false;
            while($row=mysqli_fetch_assoc($result)){
                if($row['key']==$i)
                    $i++;
                else{
                    $index=$i;
                    $t_set=true;
                    break;
                }
            }
            if(!$t_set){
                $index=$i;
            }
        }
        $timestamp=time()*1000;
        $timestamp_=$timestamp+100;
        //$sql="INSERT INTO `bingog`(`roomid`,`playerid`,`name`,`max`) VALUES('".$id."',$playerid,'".$name."',$max)";
        $sql="INSERT INTO `chat`(`sender`, `message`, `time`, `key`) VALUES ('".$sender."','".$message."',$timestamp,$index)";
        $n_res=$db->query($sql);

        //update update_details set timestamp=1610976482581 where name='chat';

        $sql="UPDATE `update_details` SET `timestamp`=$timestamp_ WHERE `name`='chat'";
        //UPDATE `update_details` SET `timestamp`=1610980672598 WHERE `name`='chat';
        $n_res=$db->query($sql);
        $finresult=$n_res;
    }
}
$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
echo json_encode($finresult);

?>