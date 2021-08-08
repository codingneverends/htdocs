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

function getranuuid_anw($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `theatre` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return getranuuid_anw();
    }
    return $ran;
}
function getranuuid_perform($db){
    $ran=rand(0,1000000);
    $sql="SELECT COUNT(*) AS `count` FROM `perfomance` WHERE `uuid`='".$ran."'";
    $result=$db->query($sql);
    $data=mysqli_fetch_assoc($result);
    if($data['count']!=0){
        return getranuuid_perform();
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
    if($act=="getlinkdetails"){
        $sql="SELECT * FROM `persons`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['persons'][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `movies`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['movies'][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `mplinks`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['mplinks'][$i]=$row;
                $i++;
            }
        }
    }
    /*
    data.append('status', 'linkmp');
    data.append('delete',islinkedMP);
    data.append('person_id',_person);
    data.append('movie_id',_movie); */
    if($act=="linkmp" && checkuuid($db,$uuid)){
        $del=$_POST['delete'];
        $movie_id=$_POST['movie_id'];
        $person_id=$_POST['person_id'];
        $tag=$_POST['tag'];
        if($del==1){
            $sql="DELETE FROM `mplinks` WHERE `movie_id`=$movie_id AND `person_id`=$person_id";
            $result=$db->query($sql);
            $finresult["respone"]=$result." delete";
        }
        else{
            $sql="INSERT INTO `mplinks`(`movie_id`, `person_id`, `tag`) VALUES ($movie_id,$person_id,'".$tag."')";
            $result=$db->query($sql);
            $finresult["respone"]=$result." insert";
        }
        $sql="SELECT * FROM `mplinks`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['mplinks'][$i]=$row;
                $i++;
            }
        }
    }
    if($act=="linkmg" && checkuuid($db,$uuid)){
        $movie_id=$_POST['movie_id'];
        $genre=$_POST['genre'];
        $sql="SELECT COUNT(*) as `count` from `generes` WHERE `movie_id`=$movie_id AND `string`='".$genre."'";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult=false;
        if($data['count']==0){
            $sql="INSERT INTO `generes`(`movie_id`, `string`) VALUES ($movie_id,'".$genre."')";
            $result=$db->query($sql);
            $finresult=$result;
        }
    }
    if($act=="addnewtheatre" && checkuuid($db,$uuid)){
        $name=$_POST['name'];
        $noseats=$_POST['noseats'];
        $_uuid=getranuuid_anw($db);
        $sql="INSERT INTO `theatre` (`uuid`, `noseats`, `name`) VALUES ($_uuid,$noseats,'".$name."')";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="getforshow"){
        $sql="SELECT * FROM `theatre`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['theatres'][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * FROM `movies`";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['movies'][$i]=$row;
                $i++;
            }
        }
    }
    if($act=="regnewshow" && checkuuid($db,$uuid)){
        $ran=getranuuid_perform($db);
        $movie_id=$_POST['movie_id'];
        $theatre=$_POST['theatre_id'];
        $starttime=$_POST['starttime'];
        $duration=$_POST['duration'];
        $price=$_POST['price'];
        $sql="INSERT INTO `perfomance`(`uuid`,`theatre_id`, `movie_id`, `starttime`, `duration`, `price`) VALUES ($ran,$theatre,$movie_id,'".$starttime."',$duration,$price)";
        $result=$db->query($sql);
        $finresult['res']=$result;
    }
    if($act=="gettheatres"){
        $movie_id=$_POST['movie_id'];
        $sql="SELECT perfomance.uuid as p_id,perfomance.theatre_id as id,perfomance.starttime as starttime FROM movies INNER JOIN perfomance where perfomance.movie_id=movies.uuid AND perfomance.movie_id=$movie_id";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $_theatre_id=(int)$row["id"];
                $finresult[$i]["uuid"]=$_theatre_id;
                $finresult[$i]["starttime"]=$row["starttime"];
                $finresult[$i]["perfomance_id"]=$row["p_id"];
                $_sql="SELECT * FROM theatre WHERE uuid=$_theatre_id";
                $_result=$db->query($_sql);
                $finresult[$i]["name"]=mysqli_fetch_assoc($_result)["name"];
                $finresult[$i]["movie_id"]=$movie_id;
                $i++;
            }
        }
    }
    if($act=="getshowdetails"){
        $perfomance_id=$_POST['perfomance_id'];
        $sql="SELECT * from `perfomance` WHERE `uuid`=$perfomance_id";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult['perfomance']=$data;
        $_theatre_id=(int)$data["theatre_id"];
        $_movie_id=(int)$data["movie_id"];
        $sql="SELECT * from `theatre` WHERE `uuid`=$_theatre_id";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult['theatre']=$data;
        $sql="SELECT * from `pulinks` WHERE `perfomance_id`=$perfomance_id";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult['seats'][$i]=$row;
                $i++;
            }
        }
        $sql="SELECT * from `movies` WHERE `uuid`=$_movie_id";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        $finresult['movie']=$data;
    }
    if($act=="bookshow"){
        $perfomance_id=(int)$_POST['perfomance_id'];
        $user_id=(int)$_POST["user_id"];
        $seats=$_POST["seats"];
        $sql="SELECT * from `pulinks` WHERE `perfomance_id`=$perfomance_id AND `user_id`=$user_id";
        $result=$db->query($sql);
        $data=mysqli_fetch_assoc($result);
        if($data){
            $finresult['act']="Updation";
            $_seats=$data['seats'];
            $seats=$_seats."-".$seats;
            $sql="UPDATE `pulinks` SET `seats`='".$seats."' WHERE `perfomance_id`=$perfomance_id AND `user_id`=$user_id";
        }
        else{
            $finresult['act']="Insertion";
            $sql="INSERT INTO `pulinks` (`perfomance_id`, `user_id`, `seats`) VALUES ($perfomance_id,$user_id,'".$seats."')";
        }
        $result=$db->query($sql);
        $finresult['res']=$result;
    }
    if($act=="getallbookings"){
        $uuid=$_POST["uuid"];
        $sql="SELECT * from `pulinks` WHERE `user_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $finresult[$i]["bookings"]=$row;
                $perfomance_id=$row["perfomance_id"];
                $sql="SELECT * from `perfomance` WHERE `uuid`=$perfomance_id";
                $_result=$db->query($sql);
                $row=mysqli_fetch_assoc($_result);
                $finresult[$i]["perfomance"]=$row;
                $theatre_id=$row["theatre_id"];
                $movie_id=$row["movie_id"];
                $sql="SELECT * FROM `movies` WHERE `uuid`=$movie_id";
                $_result=$db->query($sql);
                $row=mysqli_fetch_assoc($_result);
                $finresult[$i]["movie"]=$row;
                $sql="SELECT * FROM `theatre` WHERE `uuid`=$theatre_id";
                $_result=$db->query($sql);
                $row=mysqli_fetch_assoc($_result);
                $finresult[$i]["theatre"]=$row;
                $i++;
            }
        }
    }
    if($act=="deleteuser" && checkuuid($db,$uuid)){
        $uuid=(int)$_POST["user_id"];
        $sql="DELETE FROM `pulinks` WHERE `user_id`=$uuid";
        $result=$db->query($sql);
        $sql="DELETE FROM `mulinks` WHERE `user_id`=$uuid";
        $result=$db->query($sql);
        $sql="DELETE FROM `user` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="deletemovie" && checkuuid($db,$uuid)){
        $uuid=(int)$_POST["movie_id"];
        $sql="DELETE FROM `generes` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        $finresult["res1"]=$result;
        $sql="DELETE FROM `mplinks` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        $finresult["res2"]=$result;
        $sql="DELETE FROM `mulinks` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        $finresult["res3"]=$result;
        $sql="SELECT * FROM `perfomance` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        if($result){
            $i=0;
            while($row=mysqli_fetch_assoc($result)){
                $_id=(int)$row["uuid"];
                $_sql="DELETE FROM `pulinks` WHERE `perfomance_id`=$_id";
                $_result=$db->query($_sql);
                $finresult["res_4"][$i]=$_result;
            }
        }
        $sql="DELETE FROM `perfomance` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        $finresult["res4"]=$result;
        $sql="DELETE FROM `soundtrack` WHERE `movie_id`=$uuid";
        $result=$db->query($sql);
        $finresult["res5"]=$result;
        $sql="DELETE FROM `movies` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult["res6"]=$result;
    }
    if($act=="deleteperson" && checkuuid($db,$uuid)){
        $uuid=(int)$_POST["person_id"];
        $sql="DELETE FROM `mplinks` WHERE `person_id`=$uuid";
        $result=$db->query($sql);
        $sql="DELETE FROM `soundtrack` WHERE `sungby`=$uuid OR `lyricsby`=$uuid";
        $result=$db->query($sql);
        $sql="DELETE FROM `persons` WHERE `uuid`=$uuid";
        $result=$db->query($sql);
        $finresult=$result;
    }
    if($act=="linkmpsond" && checkuuid($db,$uuid)){
        $sungby=$_POST["sungby"];
        $lyricsby=$_POST["lyricsby"];
        $movie_id=$_POST["movie_id"];
        $url=$_POST["url"];
        $_name=$_POST["name"];
        $sql="INSERT INTO `soundtrack`(`movie_id`, `lyricsby`, `sungby`, `url`,`name`) VALUES ($movie_id,$lyricsby,$sungby,'".$url."','".$_name."')";
        $result=$db->query($sql);
        if(!$result){
            $sql="UPDATE `soundtrack` SET `movie_id`=$movie_id,`lyricsby`=$lyricsby,`sungby`=$sungby WHERE `url`='".$url."'";
            $result=$db->query($sql);
        }
        $finresult=$result;
    }
}


$db->close();

header('Access-Control-Allow-Origins: *');
header('Content-Type: appilication/json');
header("Access-Control-Allow-Methods: PUT, GET, POST");
echo json_encode($finresult);

?>