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
    $sql="SELECT COUNT(*) AS `count` FROM `movies` WHERE `uuid`='".$ran."'";
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
    if($act=="addmovie" && checkuuid($db,$uuid)){
        $ran=getranuuid($db);
        $upload_dir = 'D:/Xampp/htdocs/uploads/movies/';
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
        $url="http://localhost/uploads/movies/".strval($ran).$ext;
        $imgurl=$url;
        $description=$_POST['description'];
        $title=$_POST['title'];
        $off_url=$_POST["off_url"];
        $tra_url=$_POST["tra_url"];
        $year=$_POST["year"];
        $sql="INSERT INTO `movies`(`uuid`, `title`, `description`, `off_url`, `imgurl`, `tra_url`,`year`) VALUES ($ran,'".$title."','".$description."','".$off_url."','".$url."','".$tra_url."',$year)";
        $finresult['add_movie']=$db->query($sql);
        $finresult['uuid']=$ran;
    }
    if($act=="getallmovies"){
        $sql="SELECT * FROM `movies` ORDER BY `year` DESC";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="like"){
        $movie_id=$_POST['movie_id'];
        $value=strval($_POST['value']);
        $user_id=$_POST['uuid'];
        $sql="SELECT COUNT(*) as `count` FROM `mulinks` WHERE `user_id`=$user_id AND `movie_id`=$movie_id AND `action`='"."like"."'";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        if($data['count']==0){
            $sql="INSERT INTO `mulinks` (`movie_id`, `user_id`, `action`, `value`) VALUES ($movie_id,$user_id,'"."like"."','".$value."')";
        }
        else{
            $sql="UPDATE `mulinks` SET `value`='".$value."' WHERE `user_id`=$user_id AND `movie_id`=$movie_id AND `action`='"."like"."'";        
        }
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="comment"){
        $movie_id=$_POST['movie_id'];
        $value=$_POST['comment'];
        $user_id=$_POST['uuid'];
        $sql="INSERT INTO `mulinks` (`movie_id`, `user_id`, `action`, `value`) VALUES ($movie_id,$user_id,'"."comment"."','".$value."')";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="getmoviedata"){
        $uuid=(int)$_POST["uuid"];
        $user_id=isset($_POST["user_id"])?true:false;
        $sql="SELECT * FROM `movies` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult=$data;
        $sql="SELECT * FROM `mplinks` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['persons'][$i]=$row;
                $_uuid=$row['person_id'];
                $_sql="SELECT * FROM `persons` WHERE `uuid`=$_uuid";
                $_result=$db->query($_sql);
                $_data=mysqli_fetch_assoc($_result);
                $finresult['persons'][$i]['name']=$_data['name'];
                $i++;
            }
        }
        $sql="SELECT * FROM `mulinks` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['user_actions'][$i]=$row;
                $_uuid=$row['user_id'];
                $_sql="SELECT * FROM `user` WHERE `uuid`=$_uuid";
                $_result=$db->query($_sql);
                $_data=mysqli_fetch_assoc($_result);
                $finresult['user_actions'][$i]['name']=$_data['name'];
                $finresult['user_actions'][$i]['imgurl']=$_data['imgurl'];
                $i++;
            }
        }
        $sql="SELECT * FROM `generes` WHERE `movie_id`=$uuid"; 
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['genres'][$i]=$row['string'];
                $i++;
            }
        }
        $finresult['isbooked']=false;
        if($user_id){
            $user_id=(int)$_POST['user_id'];
            $sql="SELECT COUNT(*) as `count` FROM `perfomance` INNER JOIN pulinks ON pulinks.perfomance_id=perfomance.uuid WHERE perfomance.movie_id=$uuid AND pulinks.user_id=$user_id";            
            $result=$db->query($sql);
            $finresult['aa_tr']=$result;
            if($result){
                $data=mysqli_fetch_assoc($result);
                if($data['count']!=0){
                    $finresult['isbooked']=true;
                }
            }
        }
        $sql="SELECT * FROM `soundtrack` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['songs'][$i]=$row;
                $_uuid=(int)$row['sungby'];
                $_sql="SELECT * FROM `persons` WHERE `uuid`=$_uuid";
                $_result=$db->query($_sql);
                $_data=mysqli_fetch_assoc($_result);
                $finresult['songs'][$i]["sungby_name"]=$_data['name'];
                $_uuid=(int)$row['lyricsby'];
                $_sql="SELECT * FROM `persons` WHERE `uuid`=$_uuid";
                $_result=$db->query($_sql);
                $_data=mysqli_fetch_assoc($_result);
                $finresult['songs'][$i]["lyricsby_name"]=$_data['name'];
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