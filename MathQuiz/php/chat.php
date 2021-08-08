<?php

    $host="127.0.0.1";
    $port=8090;
    set_time_limit(0);

    $sock=socket_create(AF_INET,SOCK_STREAM,0) or die("Could not create socket.\n");
    $result=socket_bind($sock,$host,$port) or die("Could not bind to socket.\n");

    $result=socket_listen($sock,3) or die("Could not set up socket listener\n");
    echo "Listening for connections...";
    do
    {
        $accept=socket_accept($sock) or die("Could not accept incoming connection.");
        $msg=socket_read($accept,1024) or die("Could not read input\n");
        $msg=trim($msg);
		$msg=explode("\n",$msg)[0];
        echo "\nClient Says:\tCBA\t".$msg."\tABC\n";
        
        if($msg=="GET /MathQuiz/php/chat.php HTTP/1.1\n"){
            $reply="200";
			echo "connecting..\n";
		}
        else
            $reply="hii";

        socket_write($accept,$reply,strlen($reply)) or die("Coulld not write Output");
    }while (true);

    socket_close($accept,$sock);

?>