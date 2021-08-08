<?php

$to = 'gaganlal7171@gmail.com';
$subject = 'Subject';
$message = 'Hi Gagan , PHP is next level';
$headers = 'From: localhost@gagan.cne' . "\r\n" .
        'Reply-To: gaganlal7171@gmail.com' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();


//PHP Mail function return boolean value
if (mail($to, $subject, $message, $headers)) {
    echo "Mail sent!";
}
?>