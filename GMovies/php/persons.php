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

function getranuuid($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `persons` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return getranuuid();
    }
    return $ran;
}

function checkuuid($db,$uuid){
    if($uuid){
        $sql="SELECT `role` FROM `user` WHERE `uuid`='".$uuid."'";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        if($data['role']=='admin'){
            return true;
        }
    }
    return false;
}

//Logs users in

$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    $uuid=isset($_POST['uuid'])?$_POST['uuid']:0;
    $ext=isset($_POST['ext'])?$_POST['ext']:"nil";
    if($act=="addperson" && checkuuid($db,$uuid)){
        $ran=getranuuid($db);
        $upload_dir = 'D:/Xampp/htdocs/uploads/persons/';
        $server_url = '';

        if($_FILES['imgurl'])
        {
            $avatar_name = $_FILES["imgurl"]["name"];
            $avatar_tmp_name = $_FILES["imgurl"]["tmp_name"];
            $error = $_FILES["imgurl"]["error"];
        
            if($error > 0){
                $response = array(
                    "status" => "error",
                    "error" => true,
                    "message" => "Error uploading the file!"
                );
            }else 
            {
                $upload_name =  $upload_dir.strval($ran).$ext;
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
        $url="http://localhost/uploads/persons/".strval($ran).$ext;
        $imgurl=$url;
        $tag=$_POST['tag'];
        $birthplace=$_POST["birthplace"];
        $name=$_POST["name"];
        $birthdate=$_POST["birthdate"];
        $sql="INSERT INTO `persons`(`uuid`, `birthplace`, `birthdate`, `name`, `tag` , `imgurl` ) VALUES ($ran,'".$birthplace."','".$birthdate."','".$name."','".$tag."','".$imgurl."')";
        $finresult['add_person']=$db->query($sql);
        $finresult['uuid']=$ran;
    }
    if($act=="getallpersons"){
        $sql="SELECT * FROM `persons`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="getpersondata"){
        $uuid=$_POST["uuid"];
        $sql="SELECT * FROM `persons` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult=$data;
        $sql="SELECT * FROM `mplinks` WHERE `person_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['movies'][$i]=$row;
                $_uuid=$row['movie_id'];
                $_sql="SELECT * FROM `movies` WHERE `uuid`=$_uuid";
                $_result=$db->query($_sql);
                $_data=mysqli_fetch_assoc($_result);
                $finresult['movies'][$i]['title']=$_data['title'];
                $i++;
            }
        }
    }
}


$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
header("Access-Control-Allow-Methods: PUT, GET, POST");
echo json_encode($finresult);

?>