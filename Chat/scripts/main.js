function init(){
    CHATS.init();
}
var chats=[
    {
        sender:"Gagan",
        message:"Holaaa",
        time:1610946546076
    }
]
chats.sort((a,b)=>{return a.time<b.time?-1:1});
var CHATS={
    init(){
        this.chats=document.getElementById("chats");
        this.inject();
        this.send=document.getElementById("add");
        DataBase.init();
        this.name="Anonymous";
    },
    inject(){
        this.chats.innerHTML="";
        for(var i=0;i<chats.length;i++){
            var date = new Date(Number(chats[i].time)).toLocaleTimeString();
            this.chats.innerHTML+=`
            <div class="ele">
                <div class="df">
                    <div class="eleg1">
                        <div class="name">
                            ${chats[i].sender}
                        </div>
                        <div class="msg">
                        ${chats[i].message}
                        </div>
                    </div>
                    <div class="time">
                        ${date.split(":")[0]+":"+date.split(":")[1]+" "+date.split(" ")[1]}
                    </div>
                </div>
            </div>
            `;
        }
        this.chats.scrollTop=this.chats.scrollHeight-this.chats.clientHeight;
    },
    add(){
        var msgdiv=CHATS.send.children[0].children[0].children[0];
        var msg=msgdiv.value;
        var url="scripts/chat.php";
        var data=new FormData();
        data.append('message',msg);
        data.append('sender',CHATS.name);
        data.append('status','add');
        msgdiv.value="";
        DataBase.Invoke(url,data,(response)=>{
            //console.log("set "+response);
        });
    },
    setname(){
        var nm=document.getElementById("_name");
        var input=nm.children[0].children[0];
        var btn=nm.children[0].children[1];
        if(input.type=="text"){
            input.type="button";
            btn.innerHTML="Edit";
            CHATS.name=input.value;
        }
        else{
            input.type="text";
            btn.innerHTML="Set";
        }
    }
}

var updates=null;

var DataBase={
    init(){
        this.reqs=setInterval(DataBase.check,10);
    },
    check(){
        var url="scripts/manage.php";
        var req=new XMLHttpRequest();
        req.open('POST',url);
        req.send();
        req.onreadystatechange=(e)=>{
            if(req.readyState==4)
            {
                var _updates=JSON.parse(req.response);
                if(updates!=null)
                {
                    for(var i=0;i<updates.length;i++){
                        if(updates[i].timestamp!=_updates[i].timestamp){
                            DataBase.Invoke_(updates[i].name,i);
                            updates[i].timestamp=_updates[i].timestamp;
                        }
                    }
                }
                else{
                    updates=_updates;
                    for(var i=0;i<updates.length;i++){
                        DataBase.Invoke_(updates[i].name,i);
                    }
                }
            }
        } 
    },
    Invoke_(name,index){
        if(name=='chat'){
            var url="scripts/chat.php";
            var data=new FormData();
            data.append('status','get');
            DataBase.Invoke(url,data,(response)=>{
                chats=JSON.parse(response);
                CHATS.inject();
            });
        }
    },
    Invoke(url,data,onready){
        var req=new XMLHttpRequest();
        req.open('POST',url,true);
        req.send(data);
        req.onreadystatechange=(e)=>{
            if(req.readyState==4)
            {
                onready(req.response);
            }
        } 
    }
}