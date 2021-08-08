<?php
$_origin="localhost";
$username="root";
$password="";
$databasename="music";
//$upload_folder_path = 'D:/Xampp/htdocs/upload_music/';
$upload_folder_path='D:/Xampp/htdocs/upload_music/';
$loacal_storage_url="http://localhost/upload_music/";

$db=new mysqli($_origin,$username,$password,$databasename);
if($db->connect_error){
    die("Connection failure : " .$db->connect_error);
}
$result=array();

$final_result=array();

function checkmail($db,$email){
    $sql="SELECT COUNT(*) AS `count` FROM `user` WHERE `email`='".$email."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    return $data['count']==0;
}
function generate_random_uuid($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `user` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return generate_random_uuid($db);
    }
    return $ran;
}
function generate_random_uuid_product($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `product` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return generate_random_uuid_product($db);
    }
    return $ran;
}
function generate_random_uuid_rent($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `rent` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return generate_random_uuid_rent($db);
    }
    return $ran;
}

//Logs users in

$_get=isset($_POST['status']) ? true : false;
if($_get)
{
    $act=$_POST['status'];
    if($act=="reguser"){
        $ran=generate_random_uuid($db);
        $email=$_POST['email'];
        $password=$_POST['password'];
        $name=$_POST["name"];
        $namel=$_POST["namel"];
        $phno=$_POST["phno"];
        $final_result['email']=$email;
        $final_result['name']=$name;
        $final_result['role']="user";
        $final_result['phno']=$phno;
        if(!checkmail($db,$email)){
            $final_result['error']='mail exists';
        }
        else
        {
            $sql="INSERT INTO `user`(`uuid`, `name`, `namel`, `email`, `password`, `phno`) VALUES ($ran,'".$name."','".$namel."','".$email."','".$password."','".$phno."')";
            $final_result['user_created']=$db->query($sql);
            $final_result['uuid']=$ran;
        }
    }
    if($act=="getuser"){
        $uuid=$_POST['uuid'];
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $data["password"]="oops";
        $final_result=$data;
    }
    if($act=="login"){
        $email=$_POST["email"];
        $passsword=$_POST["password"];
        $sql="SELECT * FROM `user` WHERE `email`='".$email."' AND `password`='".$passsword."'";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $data["password"]="oops";
        $final_result=$data;
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
                $upload_name =  $upload_folder_path."profilepic".$_POST["name"];
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
        $url=$loacal_storage_url."profilepic".$_POST["name"];
        $uuid=(int)$_POST['uuid'];
        $sql="UPDATE `user` SET `imgurl`='".$url."' WHERE `uuid`=$uuid"; 
        $result_up=$db->query($sql);
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $final_result["userdata"]=$data;
        $final_result['image_updated']=$result_up;
        $final_result['response']=$response;
    }
    if($act=="specificuserdata"){
        $uuid=$_POST["uuid"];
        $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $final_result=mysqli_fetch_assoc($result);
    }
    if($act=="addnewproduct"){
        $uuid=(int)$_POST["uuid"];
        $cat=$_POST["cat"];
        $brand=$_POST["brand"];
        $chars=$_POST["chars"];
        $yof=(int)$_POST["yof"];
        $price=$_POST["price"];
        $price_o=$_POST["price_o"];
        $ran=generate_random_uuid_product($db);
        $ext=$_POST["ext"];

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
                $upload_name =  $upload_folder_path."product".$ran.$ext;
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
        $url=$loacal_storage_url."product".$ran.$ext;
        $sql="INSERT INTO `product`(`uuid`, `cat`, `brand`, `status`, `chars`, `yof`, `image`, `price`, `price_o`) VALUES ($ran,'".$cat."','".$brand."',1,'".$chars."',$yof,'".$url."',$price,$price_o)";
        $result=$db->query($sql);
        $final_result=$result;
    }
    if($act=="getallproducts"){
        $sql="SELECT * FROM `product`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="getallproducts_fd"){
        $sql="SELECT * FROM `product`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result[$i]=$row;
                if((int)$final_result[$i]['status']==0){
                    $uuid=(int)$final_result[$i]['uuid'];
                    $_sql="SELECT * FROM `rent` WHERE `product_id`=$uuid AND `ret_date`=0";
                    $_result=$db->query($_sql);
                    $final_result[$i]["rent"]=mysqli_fetch_assoc($_result);
                    $uuid=(int)$final_result[$i]["rent"]["user_id"];
                    $_sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
                    $_result=$db->query($_sql);
                    $final_result[$i]["rented_user"]=mysqli_fetch_assoc($_result);
                    $final_result[$i]["rented_user"]["password"]="nil";
                }
                $i++;
            }
        }
    }
    if($act=="rent_dets"){
        $user_id=(int)$_POST['user_id'];
        $sql="SELECT * FROM `rent` INNER JOIN `product` ON product.uuid=rent.product_id WHERE rent.user_id=$user_id AND rent.ret_date=0";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result[$i]=$row;
                $i++;
            }
        }
    }
    if($act=="getproduct_fd"){
        $uuid=(int)$_POST['uuid'];
        $sql="SELECT * FROM `product` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $final_result["product"]=mysqli_fetch_assoc($result);
        if((int)$final_result["product"]["status"]==0){
            $sql="SELECT * FROM `rent` WHERE `product_id`=$uuid AND `ret_date`=0";
            $result=$db->query($sql);
            $final_result["rent"]=mysqli_fetch_assoc($result);
            $uuid=(int)$final_result["rent"]["user_id"];
            $sql="SELECT * FROM `user` WHERE `uuid`=$uuid";
            $result=$db->query($sql);
            $final_result["rented_user"]=mysqli_fetch_assoc($result);
            $final_result["rented_user"]["password"]="nil";
        }
        $sql="SELECT * FROM `comments` WHERE `product_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result["comments"][$i]=$row;
                $_uuid=(int)$row["user_id"];
                $sql="SELECT * FROM `user` WHERE `uuid`=$_uuid";
                $_result=$db->query($sql);
                $final_result["comments"][$i]=mysqli_fetch_assoc($_result);
                $final_result["comments"][$i]["value"]=$row["value"];
                $i++;
            }
        }
    }
    if($act=="rent_return"){
        $uuid=(int)$_POST['uuid'];
        $retdate=(int)$_POST['retdate'];
        $sql="UPDATE `rent` SET `ret_date`=$retdate WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $final_result=$result;
        $sql="SELECT * FROM `rent` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $product_id=mysqli_fetch_assoc($result)["product_id"];
        $sql="UPDATE `product` SET `status`=1 WHERE `uuid`=$product_id";
        $result=$db->query($sql);
        $final_result=$result;
    }
    if($act=="setstatus"){
        $uuid=(int)$_POST['uuid'];
        $adminuuid=$_POST['adminuuid'];
        $sta=0;
        $sta=(int)$_POST['sta'];
        $sql="UPDATE `product` SET `status`=$sta WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $final_result=$result;

    }
    if($act=="getclass_fd"){
        $uuid=$_POST['uuid'];
        $sql="SELECT * FROM `class` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $final_result["class"]=mysqli_fetch_assoc($result);
        $artist_uuid=(int)$final_result["class"]["artist_id"];
        $sql="SELECT * FROM `user` WHERE `uuid`=$artist_uuid";
        $result=$db->query($sql);
        $final_result["artist"]=mysqli_fetch_assoc($result);
        $sql="SELECT * FROM `teaching` WHERE `class_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result["teaching"][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `bookings` WHERE `class_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result["bookings"][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `comments` WHERE `product_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $final_result["comments"][$i]=$row;
                $_uuid=(int)$row["user_id"];
                $sql="SELECT * FROM `user` WHERE `uuid`=$_uuid";
                $_result=$db->query($sql);
                $final_result["comments"][$i]=mysqli_fetch_assoc($_result);
                $final_result["comments"][$i]["value"]=$row["value"];
                $i++;
            }
        }
    }
    if($act=="comment"){
        $class_id=$_POST['product_id'];
        $value=$_POST['comment'];
        $user_id=$_POST['uuid'];
        $sql="INSERT INTO `comments`(`product_id`, `user_id`, `value`) VALUES ($class_id,$user_id,'".$value."')";
        $result=$db->query($sql);
        $final_result=$result;
    }
    if($act=="rent"){
        $ran=generate_random_uuid_rent($db);
        $user_id=(int)$_POST["user_id"];
        $product_id=(int)$_POST["product_id"];
        $days=(int)$_POST["days"];
        $retdate=(int)$_POST["retdate"];
        $startdate=$_POST["startdate"];
        $sql="INSERT INTO `rent`(`user_id`, `product_id`, `days`, `ret_date`, `startdate`, `uuid`) VALUES ($user_id,$product_id,$days,$retdate,'".$startdate."',$ran)";
        $result=$db->query($sql);
        $final_result=$result;
        $sql="UPDATE `product` SET `status`=0 WHERE `uuid`=$product_id";
        $result=$db->query($sql);
        $final_result=$result;
    }
}


$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
header("Access-Control-Allow-Methods: PUT, GET, POST");
echo json_encode($final_result);

?>