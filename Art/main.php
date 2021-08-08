<?php
$_origin="localhost";
$username="root";
$password="";
$databasename="art";
$upload_dir = 'D:/Xampp/htdocs/upload_art/';
$storageurl="http://localhost/upload_art/";

$db=new mysqli($_origin,$username,$password,$databasename);
if($db->connect_error){
    die("Connection failure : " .$db->connect_error);
}
$result=array();

$finresult=array();

function checkmail($db,$email){
    $sql="SELECT COUNT(*) AS `count` FROM `user` WHERE `email`='".$email."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    return $data['count']==0;
}
function getranuuid($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `user` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return getranuuid($db);
    }
    return $ran;
}
function getranuuid_artwork($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `artworks` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return getranuuid_artwork($db);
    }
    return $ran;
}
function getranuuid_class($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `class` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return getranuuid_class($db);
    }
    return $ran;
}
function getranuuid_tm($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `teaching` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return getranuuid_tm($db);
    }
    return $ran;
}
//Logs users in

$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    if($act=="reguser"){
        $ran=getranuuid($db);
        $email=$_POST['email'];
        $password=$_POST["password"];
        $name=$_POST["name"];
        $role=$_POST["role"];
        $finresult['email']=$email;
        $finresult['name']=$name;
        $finresult['role']=$role;
        if(!checkmail($db,$email)){
            $finresult['error']='mail exists';
        }
        else
        {
            $sql="INSERT INTO `user` (`uuid`, `email`, `password`, `name`, `role`) VALUES ($ran,'".$email."','".$password."','".$name."','".$role."')";
            $finresult['user_created']=$db->query($sql);
            $finresult['uuid']=$ran;
            if($role=="user"){
                //No need of verification
                $sql = "UPDATE `user` set `verified`=1 WHERE `uuid`=$ran";
                $finresult['verified_updated']=$db->query($sql);
            }
        }
    }
    if($act=='updatename'){
        $name=$_POST["name"];
        $uuid=$_POST['uuid'];
        $sql="UPDATE `user` SET `name`='".$name."' WHERE `uuid`=$uuid"; 
        $result_up=$db->query($sql);
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult=$data;
        $finresult['name_updated']=$result_up;
    }
    if($act=="getuser"){
        $uuid=$_POST['uuid'];
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $data["password"]="oops";
        $finresult=$data;
    }
    if($act=="login"){
        $email=$_POST["email"];
        $passsword=$_POST["password"];
        $sql="SELECT * FROM `user` WHERE `email`='".$email."' AND `password`='".$passsword."'";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $data["password"]="oops";
        $finresult=$data;
    }
    if($act=="updateimg"){
        $server_url = '';

        if($_FILES['image'])
        {
            $avatar_name = $_FILES["image"]["name"];
            $avatar_tmp_name = $_FILES["image"]["tmp_name"];
            $error = $_FILES["image"]["error"];
        
            if($error > 0){
                $response = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Error uploading the file!"
                );
            }else 
            {
                $upload_name =  $upload_dir."profilepic".$_POST["name"];
                if(move_uploaded_file($avatar_tmp_name , $upload_name)) {
                    $response = array(
                        "status" => "success",
                        "error" => false,
                        "message" => "File uploaded successfully",
                        "url" => $server_url."/".$upload_name
                      );
                }else
                {
                    $response = array(
                        "status" => "error",
                        "error" => true,
                        "message" => "Error uploading the file!"
                    );
                }
            }
        }else{
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "No file was sent!"
            );
        }        
        $url=$storageurl."profilepic".$_POST["name"];
        $uuid=(int)$_POST['uuid'];
        $sql="UPDATE `user` SET `imgurl`='".$url."' WHERE `uuid`=$uuid"; 
        $result_up=$db->query($sql);
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult["userdata"]=$data;
        $finresult['image_updated']=$result_up;
        $finresult['response']=$response;
    }
    if($act=="getartists"){
        $sql="SELECT * FROM `user` WHERE `role`='"."artist"."'";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="updateartistverification"){
        $uuid=$_POST["uuid"];
        $sql="UPDATE `user` SET `verified`=1 WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="updateartistverification2"){
        $uuid=$_POST["uuid"];
        $sql="UPDATE `user` SET `verified`=2 WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="specificuserdata"){
        $uuid=$_POST["uuid"];
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult=mysqli_fetch_assoc($result);
    }
    if($act=="getallworks"){
        $uuid=(int)$_POST["uuid"];
        $sql="SELECT * FROM `artworks` WHERE `user_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="addreview"){
        $class_id=(int)$_POST["classid"];
        $adminid=(int)$_POST["adminuuid"];
        $review=$_POST["review"];
        $sql="UPDATE `class` SET `review`='".$review."' WHERE `uuid`=$class_id";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="getallbookings"){
        $sql="SELECT * FROM `bookings`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="getallbookings_fd"){
        $sql="SELECT * FROM `bookings`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row;
                $user_id=(int)$row["user_id"];
                $class_id=(int)$row["class_id"];
                $sql="SELECT * FROM `user` WHERE `uuid`=$user_id";
                $_result=$db->query($sql);
                $finresult[$i]["_user"]=mysqli_fetch_assoc($_result);
                $sql="SELECT * FROM `class` WHERE `uuid`=$class_id";
                $_result=$db->query($sql);
                $finresult[$i]["_class"]=mysqli_fetch_assoc($_result);
                $i++;
            }
        }
    }
    if($act=="updatebookings"){
        $class_id=(int)$_POST["class_id"];
        $user_id=(int)$_POST["user_id"];
        $adminid=(int)$_POST["adminuuid"];
        $sql="UPDATE `bookings` SET `status`=1 WHERE `class_id`=$class_id AND `user_id`=$user_id";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="deletework"){
        $work_uuid=$_POST["work_uuid"];
        $user_id=$_POST["uuid"];
        $sql="DELETE FROM `artworks` WHERE `user_id`=$user_id AND `uuid`=$work_uuid";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="addnewartwork"){
        $uuid=(int)$_POST["uuid"];
        $title=$_POST["title"];
        $description=$_POST["description"];

        $server_url = '';

        if($_FILES['file'])
        {
            $avatar_name = $_FILES["file"]["name"];
            $avatar_tmp_name = $_FILES["file"]["tmp_name"];
            $error = $_FILES["file"]["error"];
        
            if($error > 0){
                $response = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Error uploading the file!"
                );
            }else 
            {
                $upload_name =  $upload_dir."artwork".$_POST["name"];
                if(move_uploaded_file($avatar_tmp_name , $upload_name)) {
                    $response = array(
                        "status" => "success",
                        "error" => false,
                        "message" => "File uploaded successfully",
                        "url" => $server_url."/".$upload_name
                      );
                }else
                {
                    $response = array(
                        "status" => "error",
                        "error" => true,
                        "message" => "Error uploading the file!"
                    );
                }
            }
        }else{
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "No file was sent!"
            );
        }        
        $url=$storageurl."artwork".$_POST["name"];
        $ran=getranuuid_artwork($db);
        $sql="INSERT INTO `artworks`(`uuid`, `name`, `description`, `fileurl`, `user_id`) VALUES ($ran,'".$title."','".$description."','".$url."',$uuid)";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="addnewclass"){
        $uuid=$_POST['uuid'];
        $name=$_POST['name'];
        $description=$_POST['description'];
        $artist_uuid=$_POST['artist_uuid'];
        $duration=$_POST["duration"];
        $timestamp=$_POST["timestamp"];
        $price=$_POST["price"];
        $ran=getranuuid_class($db);
        $sql="INSERT INTO `class` (`uuid`, `artist_id`, `name`, `timestamp`, `description`, `duration`, `price`) VALUES ($ran,$artist_uuid,'".$name."','".$timestamp."','".$description."',$duration,$price)";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="getallclasses"){
        $sql="SELECT * FROM `class`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="getclass_fd"){
        $uuid=$_POST['uuid'];
        $sql="SELECT * FROM `class` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult["class"]=mysqli_fetch_assoc($result);
        $artist_uuid=(int)$finresult["class"]["artist_id"];
        $sql="SELECT * FROM `user` WHERE `uuid`=$artist_uuid";
        $result=$db->query($sql);
        $finresult["artist"]=mysqli_fetch_assoc($result);
        $sql="SELECT * FROM `teaching` WHERE `class_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult["teaching"][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `bookings` WHERE `class_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult["bookings"][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `comments` WHERE `class_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult["comments"][$i]=$row;
                $_uuid=(int)$row["user_id"];
                $sql="SELECT * FROM `user` WHERE `uuid`=$_uuid";
                $_result=$db->query($sql);
                $finresult["comments"][$i]=mysqli_fetch_assoc($_result);
                $finresult["comments"][$i]["value"]=$row["value"];
                $i++;
            }
        }
    }
    if($act=="comment"){
        $class_id=$_POST['class_id'];
        $value=$_POST['comment'];
        $user_id=$_POST['uuid'];
        $sql="INSERT INTO `comments`(`class_id`, `user_id`, `value`) VALUES ($class_id,$user_id,'".$value."')";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="getartist_fd"){
        $uuid=$_POST['uuid'];
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult["artist"]=mysqli_fetch_assoc($result);
        $sql="SELECT * FROM `class` WHERE `artist_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult["classes"][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `artworks` WHERE `user_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult["works"][$i]=$row;
                $i++;
            }
        }
    }
    if($act=="book"){
        $userid=(int)$_POST["userid"];
        $classid=(int)$_POST["classid"];
        $sql="INSERT INTO `bookings`(`class_id`, `user_id`,`status`) VALUES ($classid,$userid,0)";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="addnewtm"){
        $uuid=(int)$_POST['uuid'];
        $title=$_POST["title"];
        $description=$_POST["description"];
        $classid=(int)$_POST["classid"];
        $server_url = '';

        if($_FILES['file'])
        {
            $avatar_name = $_FILES["file"]["name"];
            $avatar_tmp_name = $_FILES["file"]["tmp_name"];
            $error = $_FILES["file"]["error"];
        
            if($error > 0){
                $response = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Error uploading the file!"
                );
            }else 
            {
                $upload_name =  $upload_dir."teachingmaterials".$_POST["name"];
                if(move_uploaded_file($avatar_tmp_name , $upload_name)) {
                    $response = array(
                        "status" => "success",
                        "error" => false,
                        "message" => "File uploaded successfully",
                        "url" => $server_url."/".$upload_name
                      );
                }else
                {
                    $response = array(
                        "status" => "error",
                        "error" => true,
                        "message" => "Error uploading the file!"
                    );
                }
            }
        }else{
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "No file was sent!"
            );
        }        
        $url=$storageurl."teachingmaterials".$_POST["name"];
        $ran=getranuuid_tm($db);
        $sql="INSERT INTO `teaching`(`uuid`, `class_id`, `name`, `description`, `fileurl`) VALUES ($ran,$classid,'".$title."','".$description."','".$url."')";
        $result=$db->query($sql);
        $finresult=$result;
    }
}


$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
header("Access-Control-Allow-Methods: PUT, GET, POST");
echo json_encode($finresult);

?>