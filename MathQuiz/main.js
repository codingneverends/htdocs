const App=document.getElementById("app");
const Appchild=App.children[0];
//All are injected to Appchild.
//Username is stored in localstorage
var USERNAME=localStorage.getItem("name")||"";
//This mark functionality
const Mark=document.getElementById("showmark");
var answer="";
//Last qn storing
var LASTRESPONSE;
var Qno=0;
//Login page is loaded first
Login();
function Login(){
    Appchild.innerHTML=`
    <div class="login">
        <div class="hd">Math Quiz</div>
        <input type="text" id="username" class="inp" placeholder="Username" onkeyup="UpdateName(this)" value=${USERNAME}>
        <button onclick="login()">Start</button>
    </div>
    `;
    Mark.style.opacity=0;
    Qno=0;
}

function UpdateName(e){
    localStorage.setItem("name", e.value.trim());
    USERNAME=e.value.trim();
}
//Logs the user.
function login(){
    var url="php/login.php";
    var data=new FormData();
    data.append('status','login');
    data.append('username',USERNAME);
    Post(url,data,(response)=>{
        response=JSON.parse(response);
        console.log(response);
        ShowQn();
    })
}
//Function to extract qn from database witha post request
function ShowQn(){
    var url="php/getqn.php";
    var data=new FormData();
    data.append('status','getqn');
    data.append('id',Math.floor(Math.random()*1000));
    Post(url,data,(response)=>{
        response=JSON.parse(response);
        LASTRESPONSE=response;
        Display(response);
    })
    getLog();
}
//Displaying qn
function Display(response){
    Qno++;
    answer="";
    Appchild.innerHTML=`
        <div class="qn">
            <div id="topbar">
                Math Quiz
            </div>
            <div class="qnQ">
                Question ${Qno} 
            </div>
            <div class="qnq">
                ${response.question}
            </div>
            <input type="text" onkeyup="SetAns(this)" placeholder="Answer">
            <button onclick="Answer()">OK</button>
        </div>
    `;
}
function SetAns(ele){
    answer=Number(ele.value);
}
//Post request -- It will sxtract data as JSON format
function Post(url,data,onready){
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
function Answer(){
    const ans=Number(answer)==Number(LASTRESPONSE.answer);
    RegtoLog(LASTRESPONSE,Number(answer));
    Appchild.innerHTML=`
    <div class="qn">
        <div id="topbar">
            Math Quiz
        </div>
        <div class="status ${ans?"t":"f"}">
            <i class="fa fa-${ans?"check":"times"}" aria-hidden="true"></i> ${ans?"Correct":"Wrong"} Answer
        </div>
        ${ans?"":
        `<div class="qnq c">
            Answer is ${LASTRESPONSE.answer}
        </div>`
        }
        <div class="dff">
            <button onclick="ShowQn()">Contnue</button>
            <button onclick="finish()">Finish</button>
        </div>
    </div>
    `;
    console.log("ans");
    getLog();
}
//Anmwer saving to log
function RegtoLog(response,ans){
    var url="php/getqn.php";
    var data=new FormData();
    data.append('status','tolog');
    data.append('id',response.id);
    data.append('answer',response.answer);
    data.append('youranswer',ans);
    data.append('question',response.question);
    data.append('name',USERNAME);
    Post(url,data,(response)=>{
        getLog();
    })
}
//Finishing part all data extracting 
function finish(){
    var url="php/getqn.php";
    var data=new FormData();
    data.append('status','getlog');
    data.append('name',USERNAME);
    Post(url,data,(response)=>{
        response=JSON.parse(response);
        Finish(response);
    });
    getLog();
}
function Finish(Logs){
    var html=`
        <div class="login">
            <div class="hd">Overview</div>
            <div class="allqns">
                <div class="eqn">
                    <div class="ele g1">Question</div>
                    <div class="ele">Answer</div>
                    <div class="ele">Your Answer</div>
                    <div class="ele t">Response</div>
                </div>`;
    for(var i=0;i<Logs.length;i++){    
        const ans=Number(Logs[i].answer)==Number(Logs[i].youranswer);        
        html+=
            `<div class="eqn">
                <div class="ele g1">${Logs[i].question}</div>
                <div class="ele">${Logs[i].answer}</div>
                <div class="ele">${Logs[i].youranswer}</div>
                <div class="ele ${ans?"t":"f"}"><i class="fa fa-${ans?"check":"times"}" aria-hidden="true"></i></div>
            </div>`;
    }
    html+=`
            </div>
            <button class="fin" onclick="Login()">To Start</button>
        </div>`;
    Appchild.innerHTML=html;
    clerrecord();
}
//Clear user qnlogs
function clerrecord(){
    var url="php/getqn.php";
    var data=new FormData();
    data.append('status','clearlog');
    data.append('name',USERNAME);
    Post(url,data,(response)=>{
        console.log(response);
    });
}
// Display mark
function getLog(){
    var url="php/getqn.php";
    var data=new FormData();
    data.append('status','getlog');
    data.append('name',USERNAME);
    Post(url,data,(response)=>{
        var Logs=JSON.parse(response);
        var j=0;
        for(var i=0;i<Logs.length;i++){    
            const ans=Number(Logs[i].answer)==Number(Logs[i].youranswer);   
            if(ans)
                j++;
        }
        Mark.innerHTML=j+" / "+i;
    })
    Mark.style.opacity=1;
}