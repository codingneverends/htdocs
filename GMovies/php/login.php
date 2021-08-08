<?php
$_origin="localhost";
$username="root";
$password="";
$databasename="Gmovies";
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
        return getranuuid();
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
        $imgurl=$_POST['imgurl'];
        $email=$_POST['email'];
        $password=$_POST["password"];
        $name=$_POST["name"];
        $role=$_POST["role"];
        $finresult['email']=$email;
        $finresult['name']=$name;
        $finresult['role']=$role;
        $finresult['imgurl']=$imgurl;
        if(!checkmail($db,$email)){
            $finresult['error']='mail exists';
        }
        else
        {
            $sql="INSERT INTO `user` (`uuid`, `email`, `password`, `name`, `role`, `imgurl`) VALUES ($ran,'".$email."','".$password."','".$name."','".$role."','".$imgurl."')";
            $finresult['user_created']=$db->query($sql);
            $finresult['uuid']=$ran;
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
        $finresult['uuid']=$data['uuid'];
        $finresult['email']=$data['email'];
        $finresult['name']=$data['name'];
        $finresult['role']=$data['role'];
        $finresult['imgurl']=$data['imgurl'];
    }
    if($act=="login"){
        $email=$_POST["email"];
        $passsword=$_POST["password"];
        $sql="SELECT * FROM `user` WHERE `email`='".$email."' AND `password`='".$passsword."'";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult=$data;
    }
    if($act=="updateimg"){
        $upload_dir = 'D:/Xampp/htdocs/uploads/profilepics/';
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
                $upload_name =  $upload_dir.$_POST["name"];
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
        $url="http://localhost/uploads/profilepics/".$_POST["name"];
        $uuid=$_POST['uuid'];
        $sql="UPDATE `user` SET `imgurl`='".$url."' WHERE `uuid`=$uuid"; 
        $result_up=$db->query($sql);
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult=$data;
        $finresult['image_updated']=$result_up;
        $finresult['response']=$response;
    }
}


$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
header("Access-Control-Allow-Methods: PUT, GET, POST");
echo json_encode($finresult);

?>