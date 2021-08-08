const serverurl = "http://localhost";
const siteurl = serverurl + "/art/";
const storage = serverurl + "/upload_art/";

const user_propic = {
    init() {
        this.pro_pic = document.getElementById("user_propic");
    },
    set(url) {
        this.pro_pic.src = url;
        console.log(url);
    }
}

const App = {
    init() {
        this.app = document.getElementById("app");
    },
    sethtml(html) {
        this.app.innerHTML = html;
    }
}

const SideBar = {
        init() {
            this.sidebar = document.getElementById("sidebar");
            this.sidebarlayer = document.getElementById("sidebarlayer");
            this.sidebarlayer.style.zIndex = 1;
            this.sidebarlayer.style.background = "#000000af";
            this.opts = document.getElementById("opts");
            this.setopts();
            SideBar.hide();
        },
        hide() {
            this.sidebar.style.maxWidth = "0px";
            this.sidebarlayer.style.width = "0vw";
        },
        show() {
            this.sidebar.style.maxWidth = "650px";
            this.sidebarlayer.style.width = "100vw";
        },
        setopts(_user = false) {
            const _user_ins = User.get();
            if (_user) {
                const isartist = _user_ins.role == "artist" || _user_ins.role == "martist";
                const ismanager = _user_ins.role == "manager" || _user_ins.role == "martist";
                this.opts.innerHTML = `
                <div class="ele">
                    <i class="fa fa-paint-brush"></i>
                    <div class="opt" onclick="Home()">Home</div>
                </div>
                    ${isartist?`
                    <div class="ele">
                        <i class="fa fa-paint-brush"></i>
                        <div class="opt" onclick="AddaWork()">Upload ArtWork</div>
                    </div>
                    <div class="ele">
                        <i class="fa fa-paint-brush"></i>
                        <div class="opt" onclick="ShowMyWorks()">My Works</div>
                    </div>
                    <div class="ele">
                        <i class="fa fa-paint-brush"></i>
                        <div class="opt" onclick="TeachingMaterials(${_user_ins.uuid})">Upload Teaching Materials</div>
                    </div>
                    `:""}
                    ${ismanager?`
                    <div class="ele">
                        <i class="fa fa-paint-brush"></i>
                        <div class="opt" onclick="ManageArtists()">Artists Requests</div>
                    </div>
                    <div class="ele">
                        <i class="fa fa-paint-brush"></i>
                        <div class="opt" onclick="ManageBookings()">Bookings Requests</div>
                    </div>
                    <div class="ele">
                        <i class="fa fa-paint-brush"></i>
                        <div class="opt" onclick="AddClassPage()">Add New Class</div>
                    </div>
                    <div class="ele">
                        <i class="fa fa-paint-brush"></i>
                        <div class="opt" onclick="AddReviewPage()">Add Reviews</div>
                    </div>
                    `:""}
                <div class="ele">
                    <i class="fa fa-paint-brush"></i>
                    <div class="opt" onclick="ShowAccount()">Account</div>
                </div>
                <div class="ele">
                    <i class="fa fa-paint-brush"></i>
                    <div class="opt" onclick="LogOut()">LogOut</div>
                </div>
            `;

        } else {
            this.opts.innerHTML = `
                <div class="ele">
                    <i class="fa fa-paint-brush"></i>
                    <div class="opt" onclick="Home()">Home</div>
                </div>
                <div class="ele">
                    <i class="fa fa-paint-brush"></i>
                    <div class="opt" onclick="LoginPage()">Login/Register</div>
                </div>
            `;
        }
    }
}
function ManageBookings(){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getallbookings_fd');
    Post(url, data,(data)=>{
        console.log(data);
        var _html="";
        const bookings=JSON.parse(data);
        console.log(bookings);
        for(const i in bookings){
            const _book=bookings[i];
            if(_book.status==0){
                _html+=`
                <div class="req">
                    <div class="dfc">
                        <div class="artist">${_book._user.name} requesting for <div onclick="ShowClass(${_book._class.uuid})">${_book._class.name}</div></div>
                        <div class="accept" onclick="AorRbreqs(${_book._class.uuid},${_book._user.uuid},1)">Accept <i class="fa fa-check" aria-hidden="true"></i></div>
                        <div class="accept nope" onclick="AorbRreqs(${_book._class.uuid},${_book._user.uuid},-1)">Decline <i class="fa fa-times" aria-hidden="true"></i></div>
                    </div>
                </div>
                `;
            }
        }
        if(_html==""){
            _html="No new Booking requests.";
        }
        App.sethtml(`
        <div class="dfc full">
            <div class="gbox">
                ${_html}
            </div>
        </div>
        `);
        SideBar.hide();
    })
}
const User = {
    init() {
        this.data = {
            uuid: "nil",
            name: "Anonymous",
            email: "anony@gmail.com",
            role: "user",
            imgurl: "user.png",
            verified: 1,
            password: "nil"
        }
    },
    set(_data) {
        if (_data.password)
            _data.password = "nil";
        this.data = _data;
        if(_data.imgurl=="nil" || _data.imgurl==undefined || _data.imgurl==null){
            user_propic.set(siteurl + "/user.png");
        }
        else{
            user_propic.set(_data.imgurl);
        }
        SideBar.setopts(_data);
    },
    get() {
        return this.data;
    }
}

const msgbox={
    init(){
        this.ele=document.getElementById("msgbox");
        this.hide();
    },
    sethtml(html){
        this.ele.innerHTML=html;
    },
    show(){
        this.ele.style.opacity=1;
        this.ele.style.zIndex=5;
    },
    hide(){
        this.ele.style.opacity=0;
        this.ele.style.zIndex=-5;
    }
}

user_propic.init();
user_propic.set(siteurl + "/user.png");
App.init();
SideBar.init();
User.init();
msgbox.init();
Home();
function LogOut(){
    User.set({
        uuid: "nil",
        name: "Anonymous",
        email: "anony@gmail.com",
        role: "user",
        imgurl: "user.png",
        verified: 1,
        password: "nil"
    });
    LoginPage();
    SideBar.setopts(false);
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

function showlogin(_show = true) {
    const login_btn = document.getElementById("login_btn");
    const register_btn = document.getElementById("register_btn");
    login_btn.classList = "lele";
    register_btn.classList = "lele";
    const lr_datas = document.getElementById("lr_datas");
    lr_datas.innerHTML =
        `
        <input type="email" id="email" placeholder="Email">
        <input type="password" placeholder="Password" id="password">
        <button onclick="_Login()">Login</button>
        `;
    if (_show) {
        login_btn.classList.add("a");
    } else {
        register_btn.classList.add("a");
        lr_datas.innerHTML =
            `
            <input type="text" placeholder="Name" id="name">
            <input type="email" id="email" placeholder="Email">
            <input type="password" placeholder="Password" id="password">
            <div class="dfc iamartist">
                <input type="checkbox" id="isartist">
                <label for="isartist">I am Artist</label>
            </div>
            <button onclick="_Register()">Register</button>
            `;
    }
}

function _Register(){
    const name=document.getElementById("name").value;
    const password=document.getElementById("password").value;
    const email=document.getElementById("email").value;
    const iamartist=document.getElementById("isartist").checked;
    var _role="user";
    if(iamartist)
        _role="artist";
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'reguser');
    data.append('role', _role);
    data.append('name', name);
    data.append('email', email);
    data.append('imgurl', "nil");
    data.append('password', password);
    Post(url, data,(result)=>{
        console.log(result);
        result=JSON.parse(result);
        console.log(result);
        User.set(result);
        ShowAccount();
    });
}
function _Login(){
    const password=document.getElementById("password").value;
    const email=document.getElementById("email").value;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'login');
    data.append('email', email);
    data.append('password', password);
    Post(url, data,(result)=>{
        console.log(result);
        result=JSON.parse(result);
        console.log(result);
        User.set(result);
        ShowAccount();
    });

}
function LoginPage() {
    const _app = App.app;
    _app.innerHTML = `
    <div class="dfc full">
        <div class="gbox">
            <div class="dfc">
                <div class="lele a" onclick="showlogin(true)" id="login_btn">Login</div>
                <div class="lele" onclick="showlogin(false)" id="register_btn">Register</div>
            </div>
            <div class="dfcc" id="lr_datas">
                <input type="email" id="email" placeholder="Email">
                <input type="password" placeholder="Password" id="password">
                <button onclick="_Login()">Login</button>
            </div>
        </div>
    </div>`;
    SideBar.hide();
}

function ShowAccount() {
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'specificuserdata');
    data.append('uuid',User.get().uuid);
    Post(url,data,(dat)=>{
        dat=JSON.parse(dat);
        AccountPage(dat);
    });
}

function AccountPage(_data) {
    const _app = App.app;
    const _role = _data.role;
    const _imgurl=(_data.imgurl=="nil" || _data.imgurl==undefined || _data.imgurl==null)?"user.png":_data.imgurl;
    _app.innerHTML = `
    <div class="dfcc c full">
        <div class="gbox account dfcc">
            <div class="imgwrap dfc"><img src=${_imgurl} alt="no - image"></div>
            <label for="image"><i class="fa fa-camera"></i></label>
            <input type="file" id="image" accept="image/*" style="width:0px;height:0px" onchange="SetImage()"/>
            ${_data.verified==0?`<div class="user_datas">Pending Verification</div>`:``}
            ${_data.verified==-1?`<div class="user_datas">Request rejected</div>`:``}
            ${_data.verified==1 && _role=="artist"?`<div class="user_datas">Verified Artist</div>`:``}
            ${_role=="user"?"":
            `<div class="user_datas">${_role=="artist"?"Artist":`${_role=="manager"?"Manager":"Artist & Manager"}`}</div>`
            }
            <div class="user_datas">${_data.name}</div>
            <div class="user_datas">${_data.email.toLowerCase()}</div>
        </div>
    </div>`;
    SideBar.hide();
    if(_data.role=="artist" && _data.verified==1){
        const _uuid=_data.uuid;
        var url = siteurl + "main.php";
        var data = new FormData();
        data.append('status', 'updateartistverification2');
        data.append('uuid',_uuid);
        data.append('adminuuid',_uuid);
        Post(url,data,(dat)=>{
            console.log(dat);
        });
    }
}
function SetImage(){
    const _image=document.getElementById("image").files[0];
    const _imgname=User.get().uuid+"."+_image.name.split(".")[1];
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'updateimg');
    data.append('image', _image);
    data.append('name', _imgname);
    data.append('uuid', Number(User.get().uuid));
    Post(url, data, (data)=>{
        console.log(data);
        data=JSON.parse(data);
        const _userdata=data.userdata;
        const tempimg=URL.createObjectURL(_image);
        User.set(_userdata);
        User.data.imgurl=tempimg;
        user_propic.set(tempimg);
        AccountPage(_userdata);
    });
}
function getartists(callback){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getartists');
    Post(url,data,callback);
}
function ManageArtists(){
    getartists((data)=>{
        console.log(data);
        var _html="";
        const artists=JSON.parse(data);
        for(const i in artists){
            const artist=artists[i];
            if(artist.verified==0){
                _html+=`
                <div class="req">
                    <div class="dfc">
                        <div class="artist">${artist.name}</div>
                        <div class="accept" onclick="AorRreqs(${artist.uuid},1)">Accept <i class="fa fa-check" aria-hidden="true"></i></div>
                        <div class="accept nope" onclick="AorRreqs(${artist.uuid},-1)">Decline <i class="fa fa-times" aria-hidden="true"></i></div>
                    </div>
                </div>
                `;
            }
        }
        if(_html==""){
            _html="No new artists requests.";
        }
        App.sethtml(`
        <div class="dfc full">
            <div class="gbox">
                ${_html}
            </div>
        </div>
        `);
        SideBar.hide();
    })
}
function AorRbreqs(class_id,user_id,val=1){
    if(class_id==null || user_id==null){
        console.log("Error in uuid");
        return;
    }
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'updatebookings');
    data.append('class_id',class_id);
    data.append('user_id',user_id);
    data.append('adminuuid',User.get().uuid);
    Post(url,data,(data)=>{
        console.log(data);
        ManageBookings();
    });
}
function AorRreqs(uuid=null,val=1){ //1 for accepting
    if(uuid==null){
        console.log("Error in uuid");
        return;
    }
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'updateartistverification');
    data.append('uuid',uuid);
    data.append('adminuuid',User.get().uuid);
    Post(url,data,(data)=>{
        console.log(data);
        ManageArtists();
    });
}

function AddaWork(){
    App.sethtml(`
    <div class="dfc full">
        <div class="gbox artwork">
            <div class="dfcc">
                <div class="head">Add a Work</div>
                <input type="text" id="title" placeholder="title">
                <input type="text" id="description" placeholder="description">
                <input type="file" id="artwork">
                <i class="fa fa-plus-circle" onclick="submitawork()"></i>
            </div>
        </div>
    </div>`
    );
    SideBar.hide();
}

function submitawork(){
    const _file=document.getElementById("artwork").files[0];
    const _filename=_file.name.split(".")[0]+Math.floor(Math.random()*100)+User.get().uuid+"."+_file.name.split(".")[1];
    const _description=document.getElementById("description").value;
    const _title=document.getElementById("title").value;
    console.log(_filename);
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'addnewartwork');
    data.append('file', _file);
    data.append('name', _filename);
    data.append('title',_title);
    data.append('description',_description);
    data.append('uuid', Number(User.get().uuid));
    Post(url, data, (data)=>{
        console.log(data);
        data=JSON.parse(data);
        //Display my works
        ShowMyWorks();
    });
}
function ShowMyWorks(){
    getallworks(User.get().uuid,(works)=>{
        works=JSON.parse(works);
        var _html="";
        for(const i in works){
            const work=works[i];
            _html+=`
            <div class="work dfcc">
                <div class="dfc">
                    <div class="title">${work.name}</div>
                    <i class="fa fa-trash" aria-hidden="true" onclick="DeleteWork(${work.uuid})"></i>
                </div>
                <img src=${work.fileurl}>
                <div class="description">${work.description}</div>
            </div>`;
        }
        App.sethtml(`
        <div class="dfcc full">
            ${_html}
            <i class="fa fa-plus-circle spplus" onclick="AddaWork()"></i>
        </div>`);
        SideBar.hide();
    })
}
function getallworks(uuid,callback){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getallworks');
    data.append('uuid', uuid);
    Post(url, data,callback);
}
function DeleteWork(work_id){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'deletework');
    data.append('uuid', User.get().uuid);
    data.append('work_uuid',work_id);
    Post(url, data,(dat)=>{
        console.log(dat);
        ShowMyWorks();
    });

}
function AddClassPage(){
    getartists((data)=>{
        const _artists=JSON.parse(data);
        var _html="";
        for(const i in _artists){
            const artist=_artists[i];
            if(artist.verified>0){
                _html+=`<option value=${artist.uuid}>${artist.name}</option>`;
            }
        }
        App.sethtml(`
            <div class="dfc full">
                <div class="gbox addclass dfcc">
                    <div class="wrap">
                        Artist
                        <select id="artists">
                        ${_html}
                        </select>
                    </div>
                    <input type="text" id="name" placeholder="ClassName">
                    <input type="text" id="description" placeholder="Class Description">
                    <input type="date" id="classdate">
                    <input type="time" id="classtime">
                    <input type="number" placeholder="duration" id="duration">
                    <input type="number" placeholder="price" id="price">
                    <i class="fa fa-plus-circle spplus" onclick="AddNewClass()"></i>
                </div>
            </div>`);
        SideBar.hide();
    })
}
function TeachingMaterials(uuid){
    getclasses((data)=>{
        data=JSON.parse(data);
        const classes=data.filter(ele=>ele.artist_id==uuid);
        console.log(classes);
        var _html="";
        for(const i in classes){
            const _class=classes[i];
            _html+=`<option value=${_class.uuid}>${_class.name}</option>`;
        }
        App.sethtml(`
        <div class="dfc full">
            <div class="gbox addclass dfcc">
                <div class="head">Teaching Material Upload</div>
                <div class="wrap">
                    Class Name : 
                    <select id="tmupload">
                        ${_html}
                    </select>
                </div>
                <input type="text" id="name" placeholder="Titile">
                <input type="text" id="description" placeholder="Description">
                <input type="file" id="tmfile">
                <i class="fa fa-plus-circle spplus" onclick="AddNewTM()"></i>
            </div>
        </div>`);
        SideBar.hide();
    })
}
function AddNewTM(){
    const _select=document.getElementById("tmupload").value;
    const _name=document.getElementById("name").value;
    const _description=document.getElementById("description").value;
    const _file=document.getElementById("tmfile").files[0];
    const _filename=_file.name.split(".")[0]+Math.floor(Math.random()*100)+_select+"."+_file.name.split(".")[1];
    const _uuid=User.get().uuid;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'addnewtm');
    data.append('classid',_select);
    data.append('file', _file);
    data.append('name', _filename);
    data.append('title',_name);
    data.append('description',_description);
    data.append('uuid', Number(_uuid));
    Post(url, data, (data)=>{
        console.log(data);
        data=JSON.parse(data);
        console.log(data);
    });

}
function AddNewClass(){
    const artist_uuid=document.getElementById("artists").value;
    const classname=document.getElementById("name").value;
    const classdes=document.getElementById("description").value;
    const classdate=document.getElementById("classdate").value;
    const classtime=document.getElementById("classtime").value;
    const duration=document.getElementById("duration").value;
    const _price=document.getElementById("price").value;
    const _date=new Date(classdate).getTime();
    const _time=(Number(classtime.split(":")[0])*60+Number(classtime.split(":")[1]))*60*1000;
    const _timestamp=new Date(_date+_time).getTime();
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'addnewclass');
    data.append('uuid', User.get().uuid);
    data.append('name',classname);
    data.append('description',classdes);
    data.append('artist_uuid',artist_uuid);
    data.append('duration',duration);
    data.append('timestamp',_timestamp);
    data.append('price',_price);
    Post(url, data,(dat)=>{
        console.log(dat);
    });
}
function getclasses(callback){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getallclasses');
    Post(url, data,callback);
}
function getbookings(callback){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getallbookings');
    Post(url, data,callback);
}
function getartistsandclasses(callback){
    getbookings((data)=>{
        const _bookings=JSON.parse(data);
        getartists((data)=>{
            const _artists=JSON.parse(data);
            getclasses((data)=>{
                const _calsses=JSON.parse(data);
                var _json={};
                _json["classes"]=_calsses;
                _json["artists"]=_artists;
                _json["bookings"]=_bookings;
                callback(_json);
            })
        })
    })
}
function Home(){
    getartistsandclasses(data=>{
        console.log(data);
        const _classes=data.classes;
        const _artists=data.artists;
        const _uuid_=User.get().uuid;
        var bookings;
        if(_uuid_!="nil"){
            bookings=data.bookings.filter(_book=>_book.user_id==_uuid_);
            console.log(bookings);
        }
        var _html="";
        for(const i in _classes){
            const _class=_classes[i];
            var _book=`Book ${_class.price}rs`;
            if(_uuid_!="nil"){
                const _booked=bookings.find(bk=>bk.class_id==_class.uuid);
                if(_booked && _booked!=undefined && _booked!=null){
                    _book=`${_booked.status==0?"Requested":"Booked"} (Show Details)`;
                    if(_booked.status==-1){
                        _book=`Rejected (Show Details)`;
                    }
                }
            }
            const _artist=_artists.find(val=>val.uuid==_class.artist_id);
            const _date=new Date(Number(_class.timestamp))
            const _status=getStatusofDate(_class.timestamp,_class.duration);
            _html+=`
                <div class="entries">
                    <div class="name">${_class.name}</div>
                    <div class="des l" onclick="ShowArtist(${_artist.uuid})">By ${_artist.name}</div>
                    <div class="des">${_class.description}</div>
                    <div class="time">${_date.toDateString()} ${_date.toLocaleTimeString()}</div>
                    <div class="des">${_status.status}</div>
                    ${_status.val==0?
                    `<div class="book" onclick="ShowClass(${_class.uuid})">${_book}</div>`:
                    `<div class="book" onclick="ShowClass(${_class.uuid})">Show Details</div>`}
                </div>`;
        }
        App.sethtml(`
            <div class="dfcc full">
                ${_html}
            </div>`);
        SideBar.hide();
    });
}
var currentclassid="";
function ShowClass(uuid){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getclass_fd');
    data.append('uuid',uuid);
    Post(url, data,(response)=>{
        response=JSON.parse(response);
        currentclassid=uuid;
        const _uuid_=User.get().uuid;
        const _class=response.class;
        const _artist=response.artist;
        const _materials=response.teaching;
        const _bookings=response.bookings;
        const _comments=response.comments;
        const _date=new Date(Number(_class.timestamp));
        var _booked=`<button onclick="msgbox.show()">Book ${_class.price}rs</button>`;
        if(_uuid_!="nil" && _bookings){
            const _book=_bookings.find(bk=>bk.user_id==_uuid_);
            if(_book && _book!=undefined && _book!=null){
                _booked=`<button>${_book.status==0?"Requested":"Booked"}</button>`;
                if(_book.status==-1)
                    _booked=`<button>Rejected</button>`;
            }
        }
        if(_uuid_=="nil"){
            _booked=`<button onclick="LoginPage()">Login</button>`;
        }
        console.log(_class,_artist,_materials);
        var _html="";
        for(i in _materials){
            const _material=_materials[i];
            _html+=`
                <div class="mat">
                    <div class="dfc">
                        <div class="head">${_material.name}</div>
                        <a href=${_material.fileurl}>
                            <div class="des"><i class="fa fa-download" aria-hidden="true"></i></div>
                        </a>
                    </div>
                    <div class="des">${_material.description}</div>
                </div>`;
        }
        var in_html=`<div class="des">No Extra Teaching Materials</div>`;
        if(_html!=""){
            in_html=`
                <div class="head">Teaching Materials are Available</div>
                <div class="dfcc">
                    ${_html}
                </div>`;
        }
        const _status=getStatusofDate(_class.timestamp,_class.duration);
        var cmts="";
        for(const i in _comments){
            var _cmt=_comments[i];
            cmts+=`
                <div class="ele">
                    <img src=${_cmt.imgurl}>
                    <div class="cmt">
                        <div class="name">${_cmt.name}</div>
                        ${_cmt.value}
                    </div>
                </div>`;
        }
        App.sethtml(`
            <div class="dfcc full">
                <div class="gbox class">
                    <div class="head">Class</div>
                    <div class="head">${_class.name}</div>
                    <div class="des">${_class.description}</div>
                    <div class="des l" onclick="ShowArtist(${_artist.uuid})">By ${_artist.name}</div>
                    <div class="des">${_date.toDateString()} ${_date.toLocaleTimeString()}</div>
                    <div class="des">Duration ${_class.duration} mins</div>
                    <div class="des">${_status.status}</div>
                    ${_status.val==0?
                    `${_booked}`:""}
                    ${in_html}
                    ${_status.val==-1?
                    `<div class="head">Review</div>
                    <div class="des"> ${_class.review} </div>`:""}  
                    <div class="head">Comments</div>         
                    <div id="comments">
                        ${cmts}
                    </div>
                    <div id="cmt">
                        <input type="text" placeholder="Enter a comment" onkeyup="checkcmt(event)" id="cmt_msg">
                        <div id="cmt_btn" onclick="sendmsg()"></div>
                    </div>
                </div>
            </div>`);
        msgbox.sethtml(`
            <div class="gbox pop">
                <div class="head">${_class.name}</div>
                <button onclick="Book(${_class.uuid})">Pay ${_class.price}rs</button>
                <button onclick="msgbox.hide()">close</button>
            </div>
        `);
    });
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
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('uuid',User.get().uuid);
    data.append('status', 'comment');
    data.append('comment',comment)
    data.append('class_id',currentclassid);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        ShowClass(currentclassid);
    });
    cmt_btn.innerHTML="";
    _inp.value="";
}
function AddReviewPage(){
    getclasses((data)=>{
        const classes=JSON.parse(data);
        var _html="";
        for(const i in classes){
            const _class=classes[i];
            if(getStatusofDate(Number(_class.timestamp)).val==-1){
                _html+=`<option value=${_class.uuid}>${_class.name}</option>`;
            }
        }
        App.sethtml(`
            <div class="dfc full">
                <div class="gbox addclass dfcc">
                <br>/*Already existing review will be overridden*/<br><br>
                    <select id="selclass">
                        ${_html}
                    </select>
                    <input type="text" placeholder="Review" id="review">
                    <i class="fa fa-check-circle spplus" onclick="AddReview()"></i>
                </div>
            </div>
        `);
        SideBar.hide();
    })
}
function AddReview(){
    const _id=document.getElementById("selclass").value;
    const _review=document.getElementById("review").value;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'addreview');
    data.append('adminuuid',User.get().uuid);
    data.append('classid',_id);
    data.append('review',_review);
    Post(url, data,(response)=>{
        console.log(response);
        ShowClass(_id);
    });
}
function getStatusofDate(ts,dur){
    var dur=dur*60*1000;
    const _curdate=new Date().getTime();
    if(ts>_curdate)
        return {val : 0 , status : "Available"};
    if(ts+dur <  _curdate)
        return {val : 1 , status : "On Going"};
    return {val : -1 , status : "Ended"}
}
function Book(_id){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'book');
    data.append('userid',User.get().uuid);
    data.append('classid',_id);
    Post(url, data,(response)=>{
        console.log(response);
        msgbox.hide();
        ShowClass(_id);
    });
}
function ShowArtist(uuid){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getartist_fd');
    data.append('uuid',uuid);
    Post(url, data,(response)=>{
        console.log(response);
        const _data=JSON.parse(response);
        const _artist=_data.artist;
        const works=_data.works;
        const classes=_data.classes;
        var _workhtml="";
        var _classhtml="";
        for(const i in classes){
            const _class=classes[i];
            _classhtml+=`
            <div class="entries" onclick="ShowClass(${_class.uuid})">
                <div class="name">${_class.name}</div>
                <div class="des">${_class.description}</div>
            </div>`;
        }
        for(const i in works){
            const _work=works[i];
            _workhtml+=`
            <div class="work dfcc">
                <div class="dfc">
                    <div class="title">${_work.name}</div>
                </div>
                <img src=${_work.fileurl}>
                <div class="description">${_work.description}</div>
            </div>`;
        }
        App.sethtml(
            `<div class="full _artist">
                <div class="dfcc">
                    <img src=${_artist.imgurl} alt="">
                    <div class="name">${_artist.name}</div>
                    <div class="name">${_artist.email}</div>
                </div>
                <div class="head">Art Works</div>
                <div class="dfcc">
                    ${_workhtml}
                </div>
                <div class="head">Classes</div>
                <div class="dfcc">
                    ${_classhtml}
                </div>
            </div>`)
    });
}