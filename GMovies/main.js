const baseurl = "http://localhost/GMovies/";

var ALLMovies = "";

class User {
    constructor(uuid = null) {
        this.uuid = uuid;
        this.name = "Hayabusa";
        this.role = "user";
        this.imgurl = "http://localhost/GMovies/medias/imgs/user.png";
        this.email = "guest@gmail.com";
    }
    getdata(callback) {
        var url = baseurl + "php/login.php";
        var data = new FormData();
        data.append('status', 'getuserdata');
        data.append('uuid', this.uuid);
        Post(url, data, callback);
    }
    reguser(password, callback) {
        var url = baseurl + "php/login.php";
        var data = new FormData();
        data.append('status', 'reguser');
        data.append('role', 'user');
        data.append('name', this.name);
        data.append('email', this.email);
        data.append('imgurl', "http://localhost/GMovies/medias/imgs/user.png");
        data.append('password', password);
        Post(url, data, callback);
    }
    login(password, callback) {
        var url = baseurl + "php/login.php";
        var data = new FormData();
        data.append('status', 'login');
        data.append('email', this.email);
        data.append('password', password);
        Post(url, data, callback);
    }
    edit(name, callback) {
        var url = baseurl + "php/login.php";
        var data = new FormData();
        data.append('status', 'updatename');
        data.append('name', name);
        data.append('uuid', this.uuid);
        Post(url, data, callback);

    }
    setprofilepic(image, imgname, callback) {
        var url = baseurl + "php/login.php";
        var data = new FormData();
        data.append('status', 'updateimg');
        data.append('image', image);
        data.append('name', imgname);
        data.append('uuid', this.uuid);
        Post(url, data, callback);
    }
}

//TopBar ans SideBar in Topbar

var Topbar = {
        init() {
            this.TopBar = document.getElementById("TopBar");
            this.setback();
            this.sidebar = document.getElementById("sidebar");
            this.sidebarbg = document.getElementById("sidebarbg");
        },
        setback() {
            var _user = user.get();
            Topbar.TopBar.innerHTML = `
        <div class="wrap">
            <i class="fa fa-bars" aria-hidden="true" onclick="Topbar.SideBar(true)"></i>
            <div class="tbhead">Movies</div>
            <i class="fa fa-search" aria-hidden="true" onclick="Topbar.search()" style="padding-right:20px;font-size:1.5rem;"></i>
            <div class="chtb">
                ${_user.uuid == null ? `<div class="login" onclick="loginpage(true)">Login</div>` : `<img src=${_user.imgurl} onclick="accountpage()">`}
            </div>
            <div id="sidebarbg" onclick="Topbar.SideBar(false)"></div>
            <div id="sidebar">
                <div class="sbtop">
                    <div class="sbhead">GMovies</div>
                    <i class="fa fa-times-circle" aria-hidden="true" onclick="Topbar.SideBar(false)"></i>
                </div>
                <div class="option" onclick="home()">Home</div>
                ${_user.uuid==null?`<div class="option" onclick="loginpage()">Login/Register</div>`:""}
                ${_user.uuid!=null?`<div class="option" onclick="GetAllBookings()">My Bookings</div>`:""}
                ${_user.uuid!=null?`<div class="option" onclick="accountpage(false)">Account</div>`:""}
                ${_user.uuid!=null?_user.role=="admin"?`<div class="option" >Admin</div>`:"":""}
                ${_user.uuid!=null?_user.role=="admin"?`<div class="option" onclick="ShowAllPersons()">Persons data</div>`:"":""}
                ${_user.uuid!=null?_user.role=="admin"?`<div class="option" onclick="ShowAllMovies()">Movies data</div>`:"":""}
                ${_user.uuid!=null?_user.role=="admin"?`<div class="option" onclick="Perfomance()">Perfomance Manage</div>`:"":""}
                ${_user.uuid!=null?_user.role=="admin"?`<div class="option" onclick="Link()">Links</div>`:"":""}
                ${_user.uuid!=null?`<div class="option" onclick="logout()">Logout</div>`:""}
            </div>
        </div>
    `;
    Topbar.sidebar = document.getElementById("sidebar");
    Topbar.sidebarbg = document.getElementById("sidebarbg");
    ALLMovies="";
    },
    search(){
        Topbar.TopBar.innerHTML = `
            <div class="wrap">
                <input type="text" class="tbhead" placeholder="Search..." onkeyup="Topbar.action(event)"/>
                <i class="fa fa-times-circle" aria-hidden="true" onclick="Topbar.setback()"></i>
            </div>
        `;
    },
    action(e){
        const value=e.target.value;
        console.log("j");
        if(value && value.length!=0)
            Search(value);
        else
            home();
        if(e.keyCode==13)
            Topbar.setback();
    },
    SideBar(show=false){
        var width="0px";
        if(show){
            width="600px";
        }
        Topbar.sidebar.style.maxWidth=width;
        Topbar.sidebarbg.style.maxWidth=width=="0px"?"0px":"100%";
    }
}

function Search(val){
    if(val=="" || !val){
        home();
        return;
    }
    if(ALLMovies!=""){
        Process(ALLMovies,val);
        return;
    }
    var url = baseurl + "php/movies.php";
    var data = new FormData();
    data.append('status', 'getallmovies');
    Post(url, data, (response)=>{
        response=JSON.parse(response);
        Process(response,val);
    });
}
function Process(res,val){
    var _res=[];
    var _movies=[];
    val=val.toLowerCase();
    for(var i in res){
        var title=res[i].title.toLowerCase();
        if(title.includes(val)){
            _movies.push(res[i]);
            _res.push(title)
        }
    }
    console.log(_res,val);
    App.innerHTML=homepage(_movies);
}

//Universal User

var user = {
    init() {
        this.val = new User(null);
        Topbar.init();
    },
    set(val = null) {
        this.val = val;
        Topbar.init();
    },
    get() {
        return this.val;
    }
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

var PopUP={
    init(){
        this.ele=document.getElementById("popup");
    },
    show(html){
        this.ele.innerHTML=html;
        this.ele.style.zIndex=3;
        this.ele.style.opacity=1;
    },
    hide(){
        this.ele.style.zIndex=-3;
        this.ele.style.opacity=0;
    }
}

const App = document.getElementById("app");
user.init();
Topbar.init();
PopUP.init();
home();

function loginpage(login=true){
    Topbar.SideBar(false);
    App.innerHTML=LoginDiv(login);
}
function LoginDiv(login=true){
    return `
    <div class="wrap-dfc">
        <div class="wrap-login">
            <div class="head">GMovies</div>
            <div class="dfg1">
                <div class="ele${login?" a":""}" onclick="loginpage(true)">Login</div>
                <div class="ele${login?"":" a"}" onclick="loginpage(false)">Register</div>
            </div>
            <div class="inpts">
                ${login?"":`<input type="text" placeholder="Name" id="name">`}
                <input type="text" placeholder="Email" id="email">
                <input type="password" placeholder="Password" id="password">
                <input type="button" value="Go" onclick=${login?"Login_()":"Register()"}>
            </div>
        </div>
    </div>`;
}
var glo_lastname="";
function glo_ln(e){
    if(e.keyCode==13){
        Edit();
    }
    glo_lastname=e.target.value;
}
function accountpage(edit=false){
    Topbar.SideBar(false);
    if(!edit){
        if(glo_lastname.length>0 && glo_lastname!=null && glo_lastname!=user.get().name){
            console.log(glo_lastname);
        }
    }
    App.innerHTML= `
    <div class="wrap-dfc">
        <div class="wrap-account">
            <img src=${user.get().imgurl}>
            <label for="image"><i class="fa fa-camera cam" aria-hidden="true"></i></label>
            <input type="file" id="image" accept="image/*" style="width:0px;height:0px" onchange="SetImage()"/>
            <div class="name" id="name">
            ${!edit?`
                <div class="g1">${user.get().name}</div>
                <i class="fa fa-edit" onclick="accountpage(true)"></i>`:`
                <input class="g1" value="${user.get().name}" onkeyup="glo_ln(event)"/>
                <i class="fa fa-check" aria-hidden="true" onclick="Edit()"></i>`
            }
            </div>
        <div class="mail">${user.get().email}</div>
        <div class="lout" onclick="logout()">Logout</div>
        </div>
    </div>
`;
}
async function timer(ms){
    return new Promise(res=>setTimeout(res,ms));
}
function SetImage(){
    var file=document.getElementById("image").files[0];
    const name=user.get().uuid+"."+file.name.split(".")[1];
    user.get().setprofilepic(file,name,async (data)=>{
        console.log(data);
        data=JSON.parse(data);
        //Temp call for late update
        if(data.image_updated){
            const _user=new User(data.uuid);
            _user.email=data.email;
            _user.imgurl=URL.createObjectURL(file);
            _user.name=data.name;
            _user.role=data.role;
            user.set(_user);
        }
        accountpage(false);
    })
}
function Edit(){
    const name=glo_lastname;
    accountpage(false)
    if(name.length<1)
        return;
    user.get().edit(name,(data)=>{
        data=JSON.parse(data);
        console.log(data);
        if(data.name_updated){
            const _user=new User(data.uuid);
            _user.email=data.email;
            _user.imgurl=data.imgurl;
            _user.name=data.name;
            _user.role=data.role;
            user.set(_user);
        }
        accountpage(false);
    })
}
function Login_(){
    const password=document.getElementById("password").value;
    const email=document.getElementById("email").value;
    var temp=new User();
    temp.email=email;
    temp.login(password,(data)=>{
        data=JSON.parse(data);
        const _user=new User(data.uuid);
        _user.email=data.email;
        _user.imgurl=data.imgurl;
        _user.name=data.name;
        _user.role=data.role;
        user.set(_user);
        home();
    });

}
function Register(){
    const name=document.getElementById("name").value;
    const password=document.getElementById("password").value;
    const email=document.getElementById("email").value;
    var temp=new User();
    temp.name=name;
    temp.email=email;
    temp.reguser(password,(data)=>{
        data=JSON.parse(data);
        if(data.error){
            console.log("Error : "+data.error);
            return;
        }
        const _user=new User(data.uuid);
        _user.email=data.email;
        _user.imgurl=data.imgurl;
        _user.name=data.name;
        _user.role=data.role;
        user.set(_user);
        accountpage();
    });
}
function logout(){
    user.set(new User(null));
    loginpage();
}
class Person{
    constructor(uuid){
        this.uuid=uuid;
        this.name="Unknown";
        this.birthplace="Kerala,India";
        this.birthdate="23 october 1984";
        this.tag="actor";
        this.imgurl="http://localhost/GMovies/medias/imgs/user.png";
        this.movies={12:"The Unknow",14:"I am Best",15:"The Terror",16:"The Untold"};
    }
}
function ShowAllPersons(){
    var persons=[];
    var url = baseurl + "php/persons.php";
    var data = new FormData();
    data.append('status', 'getallpersons');
    Post(url, data, (response)=>{
        console.log(response);
        persons=JSON.parse(response);
        console.log(persons);
        App.innerHTML=showwallpersons(persons);
        Topbar.SideBar(false);
    });
}
function showwallpersons(_persons){
    html=`
    <div class="wrap-person">
        <div class="head">
            <div class="ele" onclick="addpersonpage()">Add New Person</div>
        </div>
        <div id="persons">`;
    for(var i=0;i<_persons.length;i++){
        _person=_persons[i];
        var _movies="";
        for(var j in _person.movies){
            _movies+=`<li>${_person.movies[j]}</li>`;
        }
        html+=  `<div class="ele">
                    <div class="content">
                        <div class="name">${_person.name}</div>
                        <div class="txt">
                            <p>Born on ${_person.birthdate}.Famous ${_person.tag} in ${_person.birthplace}</p>
                        </div>
                        <div class="txt">Movies are
                            <ul style="margin-left: 50px;">
                                ${
                                _movies
                                }
                            </ul>
                        </div>
                    </div>
                    <img src=${_person.imgurl}>
                </div>`;
        }
    html+=`
        </div>
    </div>`;
    return html;
}

function addpersonpage(){
    App.innerHTML=
    `<div class="wrap-person add">
        <input type="text" placeholder="Name" id="name">
        <input type="text" placeholder="Birthplace" id="birthplace">
        <input type="text" placeholder="Birthdate - 23 october 1879" id="birthdate">
        <input type="text" placeholder="Tag" id="tag">
        <input type="file" accept="image/*" id="image">
        <div class="ok" onclick="addperson()">Add</div>
    </div>`;
}
function addperson(){
    const name=document.getElementById("name").value;
    const birthplace=document.getElementById("birthplace").value;
    const birthdate=document.getElementById("birthdate").value;
    const tag=document.getElementById("tag").value;
    const _image=document.getElementById("image").files[0];
    var url = baseurl + "php/persons.php";
    var data = new FormData();
    data.append('status', 'addperson');
    data.append('uuid',user.get().uuid);
    data.append('name', name);
    data.append('birthplace', birthplace);
    data.append('birthdate', birthdate);
    data.append('tag',tag);
    data.append('ext',"."+_image.name.split(".")[1]);
    data.append('imgurl',_image);
    Post(url, data, (response)=>{
        console.log(response);
        ShowAllPersons();
    });
}
function ShowAllMovies(){
    var movies=[];
    var url = baseurl + "php/movies.php";
    var data = new FormData();
    data.append('status', 'getallmovies');
    Post(url, data, (response)=>{
        console.log(response);
        movies=JSON.parse(response);
        console.log(movies);
        App.innerHTML=showwallmovies(movies);
        Topbar.SideBar(false);
    });
}
function showwallmovies(_movies){
    html=`
    <div class="wrap-person">
        <div class="head">
            <div class="ele" onclick="addmoviepage()">Add New Movie</div>
        </div>
        <div id="persons">`;
    for(var i=0;i<_movies.length;i++){
        _movie=_movies[i];
        var _persons="";
        for(var j in _movie.persons){
            _persons+=`<li>${_movie.persons[j].tag+" : "+_movie.persons[j].name}</li>`;
        }
        html+=  `<div class="ele movie">
                    <div class="name">${_movie.title}</div>
                    <img src=${_movie.imgurl}>
                    <div class="content">
                        <div class="txt">
                            <p>${_movie.description}.</p>
                            <p class="links">Official imbd url <a href=${_movie.off_url}>${_movie.off_url}</a>.</p>
                            <p class="links" >Trailor url <a href=${_movie.tra_url}>${_movie.tra_url}</a>.</p>
                        </div>
                        <div class="txt">
                            <ul style="margin-left: 50px;">
                                ${
                                _persons
                                }
                            </ul>
                        </div>
                    </div>
                </div>`;
        }
    html+=`
        </div>
    </div>`;
    return html;
}
function addmoviepage(){
    App.innerHTML=
    `<div class="wrap-person add">
        <input type="text" placeholder="Title" id="title">
        <input type="text" placeholder="description" id="description">
        <input type="text" placeholder="official url" id="off_url">
        <input type="text" placeholder="trailor url" id="tra_url">
        <input type="text" placeholder="Year" id="_year">
        <input type="file" accept="image/*" id="image">
        <div class="ok" onclick="addmovie()">Add</div>
    </div>`;
}
function addmovie(){
    const title=document.getElementById("title").value;
    const description=document.getElementById("description").value;
    const off_url=document.getElementById("off_url").value;
    const tra_url=document.getElementById("tra_url").value;
    const _image=document.getElementById("image").files[0];
    const _year=Number(document.getElementById("_year").value);
    var url = baseurl + "php/movies.php";
    var data = new FormData();
    data.append('status', 'addmovie');
    data.append('year',_year);
    data.append('uuid',user.get().uuid);
    data.append('title', title);
    data.append('description', description);
    data.append('off_url', off_url);
    data.append('tra_url', tra_url);
    data.append('ext',"."+_image.name.split(".")[1]);
    data.append('imgurl',_image);
    Post(url, data, (response)=>{
        console.log(response);
        ShowAllMovies();
    });
}
function Link(){
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'getlinkdetails');
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        App.innerHTML=linkpage(response);
        InvokeMP();
        Topbar.SideBar(false);
    });
}
var mplinks;
var l_persons;
function linkpage(response){
    const movies=response.movies;
    const persons=response.persons;
    l_persons=persons;
    mplinks=response.mplinks;
    var movies_opts="";
    var persons_opts="";
    for(var key in movies)
        movies_opts+=`<option value=${movies[key].uuid}>${movies[key].title}</option>`;
    for(var key in persons)
        persons_opts+=`<option value=${persons[key].uuid}>${persons[key].name}</option>`;
    html=`
    <div class="dblinking">
        <div class="ele">Movies and Persons</div>
        <div class="ele">
            <label for="movies">Movie</label>
            <select id="movies" onclick="InvokeMP()">
                ${movies_opts}
            </select>
        </div>
        <div class="ele">
            <label for="persons">Person</label>
            <select id="persons" onclick="InvokeMP()">
                ${persons_opts}
            </select>
        </div>
        <input type="text" placeholder="tag eg actor" id="tag" class="ele">
        <button class="ele" id="linkbtn" onclick="DB_LinkMP()">Link</button>
    </div>
    <div class="dblinking">
        <div class="ele">Sound Track</div>
        <div class="ele">
            <label for="movies">Movie</label>
            <select id="movies_s">
                ${movies_opts}
            </select>
        </div>
        <div class="ele">
            <label for="persons_ss">Sung By</label>
            <select id="persons_ss">
                ${persons_opts}
            </select>
        </div>
        <div class="ele">
            <label for="persons_sl">Lyrics By</label>
            <select id="persons_sl">
                ${persons_opts}
            </select>
        </div>
        <input type="text" placeholder="Track name" id="tag_s_name" class="ele">
        <input type="text" placeholder="Track url" id="tag_s" class="ele">
        <button class="ele" id="linksoundbtn" onclick="DB_LinkMPSound()">Add</button>
    </div>
    <div class="dblinking">
        <div class="ele">Movies and Genres</div>
        <div class="ele">
            <label for="movies_g">Movie </label>
            <select id="movies_g" onclick="InvokeMP()">
                ${movies_opts}
            </select>
        </div>
        <input type="text" placeholder="tag eg actor" id="genre" class="ele">
        <button class="ele" id="genre_btn" onclick="DB_LinkMG()">Add Genre</button>
    </div>
    <div class="dblinking">
        <div class="ele">Delete Movie</div>
        <div class="ele">
            <label for="movies_d">Movie </label>
            <select id="movies_d">
                ${movies_opts}
            </select>
        </div>
        <button class="ele" onclick="_DeleteMovie()">Delete</button>
    </div>
    <div class="dblinking">
        <div class="ele">Delete Person</div>
        <div class="ele">
            <label for="person_d">Person </label>
            <select id="person_d">
                ${persons_opts}
            </select>
        </div>
        <button class="ele" onclick="_DeletePerson()">Delete</button>
    </div>
    `;
    return html;
}
function _DeleteMovie(){
    const id=Number(document.getElementById("movies_d").value);
    DeleteMovie(id,(response)=>{
        console.log(response);
        Link();
    });
}
function _DeletePerson(){
    const id=Number(document.getElementById("person_d").value);
    console.log(id);
    DeletePerson(id,(response)=>{
        console.log(response);
        Link();
    });
}
var islinkedMP=false;
function DB_LinkMP(){
    const _movie=document.getElementById("movies").value;
    const _person=document.getElementById("persons").value;
    const _tag=document.getElementById("tag").value;
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('uuid',user.get().uuid);
    data.append('status', 'linkmp');
    data.append('delete',islinkedMP?1:0);
    data.append('person_id',_person);
    data.append('movie_id',_movie);
    data.append('tag',_tag);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        mplinks=response.mplinks;
        InvokeMP();
    });
}
function DB_LinkMPSound(){
    const _movie=document.getElementById("movies_s").value;
    const _sungby=document.getElementById("persons_ss").value;
    const _lyricsby=document.getElementById("persons_sl").value;
    const _url=document.getElementById("tag_s").value;
    const _name=document.getElementById("tag_s_name").value;
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('uuid',user.get().uuid);
    data.append('status', 'linkmpsond');
    data.append('sungby',_sungby);
    data.append('lyricsby',_lyricsby);
    data.append('movie_id',_movie);
    data.append('url',_url);
    data.append('name',_name);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        Perfomance();
    });
}
function DeleteTrack(url){
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('uuid',user.get().uuid);
    data.append('status', 'deletetrack');
    data.append('url',_url);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
    });
}
function DB_LinkMG(){
    const _movie=document.getElementById("movies_g").value;
    const _genre=document.getElementById("genre").value.toLowerCase();
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('uuid',user.get().uuid);
    data.append('status', 'linkmg');
    data.append('movie_id',_movie);
    data.append('genre',_genre);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
    });
    document.getElementById("genre").value="";
}
function Like(_movie,val){
    var url = baseurl + "php/movies.php";
    var data = new FormData();
    data.append('uuid',user.get().uuid);
    data.append('status', 'like');
    data.append('value',val)
    data.append('movie_id',_movie);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        getmoviedata(_movie);
    });
}
function InvokeMP(){
    islinkedMP=false;
    const _movie=document.getElementById("movies").value;
    const _person=document.getElementById("persons").value;
    const linkbtn=document.getElementById("linkbtn");
    linkbtn.innerHTML="Link";
    for(var key in mplinks){
        if(mplinks[key].movie_id==_movie && mplinks[key].person_id==_person){
            linkbtn.innerHTML="UNLink";
            islinkedMP=true;
        }
    }
    for(var key in l_persons){
        if(l_persons[key].uuid==_person){
            document.getElementById("tag").value=l_persons[key].tag;
        }
    }
}
function home(){
    var movies=[];
    var url = baseurl + "php/movies.php";
    var data = new FormData();
    data.append('status', 'getallmovies');
    Post(url, data, (response)=>{
        console.log(response);
        movies=JSON.parse(response);
        App.innerHTML=homepage(movies);
        Topbar.SideBar(false);
    });
}
function homepage(_movies){
    var html=`<div class="home">`;
    for(var key in _movies){
        var _movie=_movies[key];
        html+=    `
            <div class="smovie" style="background-image: url(${_movie.imgurl});" onclick="getmoviedata(${_movie.uuid})">
                <div class="dum">.</div>
                <div class="title">${_movie.title} (${_movie.year})</div>
            </div>
        `
    }
    html+=`</div>`;
    return html;
}
function getmoviedata(uuid){
    var url = baseurl + "php/movies.php";
    var data = new FormData();
    data.append('status', 'getmoviedata');
    data.append('uuid',uuid);
    if(user.get().uuid)
        data.append('user_id',user.get().uuid);
    Post(url, data, (response)=>{
        console.log(response);
        _movie=JSON.parse(response);
        console.log(_movie);
        App.innerHTML=moviedatapage(_movie);
    });
}
var currentmovieid=0;
function moviedatapage(_movie){
    currentmovieid=_movie.uuid;
    const persons = _movie.persons;
    const actions = _movie.user_actions;
    const _songs = _movie.songs;
    const isbooked=_movie.isbooked || false;
    var liked=0;
    var _likes=0;
    var _dislikes=0;
    var cmts="";
    var _genres="";
    for(var key in actions){
        const action=actions[key];
        if(action.user_id==user.get().uuid && action.action=="like"){
            liked=action.value;
        }
        if(action.action=="like"){
            if(action.value==1)
                _likes++;
            if(action.value==2)
                _dislikes++;
        }
        if(action.action=="comment"){
            console.log(action.value);
            cmts+=`
            <div class="ele">
                <img src=${action.imgurl}>
                <div class="cmt">
                    <div class="name">${action.name}</div>
                    ${action.value}
                </div>
            </div>`;
        }
    }
    perhtml="";
    songhtml="";
    for(var key in persons){
        const _person=persons[key];
        perhtml+=`<div class="ele">
            <div class="tag">${_person.tag}</div>
            <div class="tag name" onclick="getpersondata(${_person.person_id})">${_person.name}</div>
        </div>`;
    }
    for(var key in _songs){
        const _song=_songs[key];
        songhtml+=`<div class="ele">
            <div class="tag name" onclick="getpersondata(${_song.url})">${_song.name}</div>
            <div class="tag name sn" onclick="getpersondata(${_song.sungby})"><div class="s">(Sung By)</div> ${_song.sungby_name}</div>
            <div class="tag name sn" onclick="getpersondata(${_song.lyricsby})"><div class="s">(Lyrics By)</div>${_song.lyricsby_name}</div>
        </div>`;
    }
    const m_gens=_movie.genres;
    for(var key in m_gens){
        _genres+=`<div class='ele'>${m_gens[key]}</div>`;
    }
    var html=`
    <div class="movie">
        <div class="title">
            ${_movie.title} (${_movie.year})
        </div>
        <div class="genres">
            ${_genres}
        </div>
        <img src=${_movie.imgurl}>
        <div class="lord">
            <div class="ele" onclick="Like(${_movie.uuid},${liked==1?0:1})"><i class="fa fa-thumbs-up" style="color:${liked!=1?"white":"#00f"}"> ${_likes}</i></div>
            <div class="ele" onclick="Like(${_movie.uuid},${liked==2?0:2})"><i class="fa fa-thumbs-down" style="color:${liked!=2?"white":"#f00"}"> ${_dislikes}</i></div>
            <a href="#comments"><div class="ele"><i class="fa fa-comments" aria-hidden="true"></i></div></a>
            <div class="ele ticket" onclick=${user.get().uuid==null?"loginpage(true)":`"gettheatres(${_movie.uuid},'${_movie.title}')"`}>
                <i class="fa fa-ticket" aria-hidden="true" style="color:${isbooked?"#0f0":"#f00"}"></i>
            </div>
        </div>
        <div class="des">
            ${_movie.description}
        </div>
        <div class="txt">
            Watch <a href=${_movie.tra_url}>Trailor</a> here.<br><br> Check <a href=${_movie.off_url}>Official Site</a>.
        </div>
        <div class="persons">
            ${perhtml}
            ${ _songs && _songs.length>0 ? `<div class="shead">Sound Tracks</div>`:""}
            ${songhtml}
        </div>
        <div id="comments">
            ${cmts}
        </div>
        <div id="cmt">
            <input type="text" placeholder="Enter a comment" onkeyup="checkcmt(event)" id="cmt_msg">
            <div id="cmt_btn" onclick="sendmsg()"></div>
        </div>
    </div>`;
    return html;
}
function checkcmt(e){
    const cmt_btn=document.getElementById("cmt_btn");
    cmt_btn.innerHTML="";
    if(e.keyCode==13){
        sendmsg();
    }
    else{
        const val=e.target.value;
        if(val.length>0){
            cmt_btn.innerHTML=`<i class="fa fa-paper-plane"></i>`;
        }
    }
}
function sendmsg(){
    const _inp=document.getElementById("cmt_msg");
    const cmt_btn=document.getElementById("cmt_btn");
    const comment=_inp.value;
    var url = baseurl + "php/movies.php";
    var data = new FormData();
    data.append('uuid',user.get().uuid);
    data.append('status', 'comment');
    data.append('comment',comment)
    data.append('movie_id',currentmovieid);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        getmoviedata(currentmovieid);
    });
    cmt_btn.innerHTML="";
    _inp.value="";
}
function getpersondata(uuid){
    var url = baseurl + "php/persons.php";
    var data = new FormData();
    data.append('status', 'getpersondata');
    data.append('uuid',uuid);
    Post(url, data, (response)=>{
        console.log(response);
        _person=JSON.parse(response);
        console.log(_person);
        App.innerHTML=persondatapage(_person);
    });
}
function persondatapage(_person){
    const movies=_person.movies;
    console.log(movies);
    var movhtml="";
    for(var key in movies){
        const _movie=movies[key];
        movhtml+=`<div class="ele">
            <div class="tag name" onclick="getmoviedata(${_movie.movie_id})">${_movie.title}</div>
        </div>`;
    }
    console.log(movhtml);
    var html=`
    <div class="movie">
        <div class="title">
            ${_person.name}
        </div>
        <img src=${_person.imgurl} class="profile">
        <div class="des">
            Born on ${_person.birthdate} . ${_person.name} is a 
            famous ${_person.tag} in ${_person.birthplace}.
        </div>
        <div class="persons">
            <div class="ele">
                <div class="tag">Movies are : </div>
            </div>
            ${movhtml}
        </div>
    </div>`;
    return html;
}