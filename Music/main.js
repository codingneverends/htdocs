const serverurl = "http://localhost";
const siteurl = serverurl + "/music/";
const storage = serverurl + "/upload_music/";

const user_propic = {
    init() {
        this.profilepic = document.getElementById("user_propic").children[0];
    },
    set(url) {
        this.profilepic.src = url;
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
            SideBar.hide();
            SideBar.setopts(false);
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
                const isadmin = _user_ins.role == "admin";
                this.opts.innerHTML = `
        <div class="ele">
            <div class="opt" onclick="Home()">Home</div>
        </div>
        <div class="ele">
            <div class="opt" onclick="Rents()">My Rentings</div>
        </div>
            ${isadmin?`
            <div class="ele">
                <div class="opt" onclick="AddProductPage()">Add New Product</div>
            </div>
            <div class="ele">
                <div class="opt" onclick="listall()">View All</div>
            </div>
            <div class="ele">
                <div class="opt" onclick="updatestatus()">Update Status</div>
            </div>
            `:""}
        <div class="ele">
            <div class="opt" onclick="ShowAccount()">Account</div>
        </div>
        <div class="ele">
            <div class="opt" onclick="LogOut()">LogOut</div>
        </div>
    `;

    } else {
        this.opts.innerHTML = `
            <div class="ele">
                <div class="opt" onclick="Home()">Home</div>
            </div>
            <div class="ele">
                <div class="opt" onclick="LoginPage()">Login/Register</div>
            </div>
        `;
    }
}
}
const User = {
    init() {
        this.data = {
            uuid: "nil",
            name: "Anonymous",
            namel:"Anon",
            email: "anony@gmail.com",
            role: "user",
            imgurl: "user.png",
            password: "nil",
            phno: "+919876453425"
        }
    },
    set(_data) {
        if (_data.password)
            _data.password = "nil";
        this.data = _data;
        if (_data.imgurl == "nil" || _data.imgurl == undefined || _data.imgurl == null) {
            user_propic.set(siteurl + "/user.png");
        } else {
            user_propic.set(_data.imgurl);
        }
        SideBar.setopts(_data);
    },
    get() {
        return this.data;
    }
}

const msgbox = {
        init() {
            this.ele = document.getElementById("msgbox");
            this.hide();
        },
        sethtml(html) {
            this.ele.innerHTML = html;
        },
        show() {
            this.ele.style.opacity = 1;
            this.ele.style.zIndex = 5;
        },
        hide() {
            this.ele.style.opacity = 0;
            this.ele.style.zIndex = -5;
        }
}

user_propic.init();
user_propic.set("user.png");
App.init();
SideBar.init();
User.init();
msgbox.init();
Home();

function LogOut() {
    User.set({
        uuid: "nil",
        name: "Anonymous",
        namel:"Anon",
        email: "anony@gmail.com",
        role: "user",
        imgurl: "user.png",
        password: "nil",
        phno: "+919876453425"
    });
    LoginPage();
    SideBar.setopts(false);
}

//Post request -- It will sxtract data as JSON format

function Post(url, data, onready) {
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.send(data);
    req.onreadystatechange = (e) => {
        if (req.readyState == 4) {
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
            <input type="text" placeholder="Sur name" id="namel">
            <input type="text" placeholder="mobile no" id="phno">
            <input type="email" id="email" placeholder="Email">
            <input type="password" placeholder="Password" id="password">
            <button onclick="_Register()">Register</button>
            `;
    }
}

function _Register() {
    const name = document.getElementById("name").value;
    const namel = document.getElementById("namel").value;
    const phno = document.getElementById("phno").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'reguser');
    data.append('name', name);
    data.append('namel', namel);
    data.append('phno', phno);
    data.append('email', email);
    data.append('imgurl', "nil");
    data.append('password', password);
    Post(url, data, (result) => {
        console.log(result);
        result = JSON.parse(result);
        console.log(result);
        User.set(result);
        ShowAccount();
    });
}

function _Login() {
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'login');
    data.append('email', email);
    data.append('password', password);
    Post(url, data, (result) => {
        console.log(result);
        result = JSON.parse(result);
        console.log(result);
        User.set(result);
        ShowAccount();
    });

}

function LoginPage() {
    const _app = App.app;
    _app.innerHTML = `
    <div class="dfcc c full">
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
    if(User.get().uuid=="nil"){
        console.log("No User");
        return;
    }
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'specificuserdata');
    data.append('uuid', User.get().uuid);
    Post(url, data, (dat) => {
        dat = JSON.parse(dat);
        _AccountPage(dat);
    });
}

function _AccountPage(_data) {
    const _app = App.app;
    const _role = _data.role;
    const _imgurl = (_data.imgurl == "nil" || _data.imgurl == undefined || _data.imgurl == null) ? "user.png" : _data.imgurl;
    _app.innerHTML = `
    <div class="dfcc c full">
        <div class="gbox account dfcc">
            <div class="imgwrap dfc"><img src=${_imgurl} alt="no - image"></div>
            <label for="image"><i class="fa fa-camera"></i></label>
            <input type="file" id="image" accept="image/*" style="width:0px;height:0px" onchange="SetImage()"/>
            ${_role=="admin"?`<div class="user_datas">Admin</div>`:""}
            <div class="user_datas">${_data.name+" "+_data.namel}</div>
            <div class="user_datas">${_data.phno}</div>
            <div class="user_datas">${_data.email.toLowerCase()}</div>
        </div>
    </div>`;
    SideBar.hide();
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
        _AccountPage(_userdata);
    });
}
function AddProductPage(){
    App.sethtml(`
            <div class="dfc full">
                <div class="addclass dfcc">
                    <h1>Add New Product</h1>
                    <input type="text" id="category" placeholder="category">
                    <input type="text" id="brand" placeholder="brand">
                    <input type="text" id="chars" placeholder="chars">
                    <input type="file" placeholder="image" id="image">
                    <input type="number" placeholder="year of manufacture" id="yof">
                    <input type="number" placeholder="cost per day" id="price">
                    <input type="number" placeholder="cost per day of overdueing" id="price_o">
                    <i class="fa fa-plus-circle spplus" onclick="AddNewProduct()"></i>
                </div>
            </div>`);
        SideBar.hide();
}
function AddNewProduct(){
    const _cat=document.getElementById("category").value.toLowerCase();
    const _brand=document.getElementById("brand").value.toLowerCase();
    const _chars=document.getElementById("chars").value.toLowerCase();
    const _yof=Number(document.getElementById("yof").value);
    const _image=document.getElementById("image").files[0];
    const _price=Number(document.getElementById("price").value);
    const _price_o=Number(document.getElementById("price_o").value);
    const _ext=_image.name.split(".")[1];
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'addnewproduct');
    data.append('uuid', User.get().uuid);
    data.append('cat',_cat);
    data.append('brand',_brand);
    data.append('chars',_chars);
    data.append('yof',_yof);
    data.append('file',_image);
    data.append('price',_price);
    data.append('price_o',_price_o);
    data.append('ext',_ext);
    Post(url, data,(dat)=>{
        console.log(dat);
        Home();
    });
}
function getallproducts(callback){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getallproducts');
    Post(url, data,(dat)=>{
        callback(dat);
    });
}
function Home(){
    getallproducts(data=>{
        const _prdcts=JSON.parse(data);
        var _html="";
        for(const i in _prdcts){
            const _prdct=_prdcts[i];
            if(_prdct.status!=1){
                continue;
                //Not available
            }
            _html+=`
            <div class="pbox" onclick="ShowProduct(${_prdct.uuid})">
                <div class="iwrap dfc">
                    <img src=${_prdct.image} alt="No image uploaded">
                </div>
                <div class="name">${_prdct.cat}</div>
            </div>`;
        }
        App.sethtml(`
        <div class="products">
            ${_html==""?`
                <h3>No products are here</h3>
            `:``}
            ${_html}
        </div>
        `);
        SideBar.hide();
    })
}
var currentproductid;
function ShowProduct(_uuid){
    currentproductid=_uuid;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getproduct_fd');
    data.append('uuid', _uuid);
    Post(url, data,(dat)=>{
        console.log(dat);
        const _data=JSON.parse(dat);
        console.log(_data);
        const _product=_data.product;
        const _user=_data.rented_user;
        const _rent=_data.rent;
        const _comments=_data.comments;
        msgbox.sethtml(`
            <div class="gbox pop">
                <div class="head">${Caps(_product.cat)}</div>
                <div class="dfc">
                Rent For : 
                <select id="payabt" onchange="changepayval()">
                    <option value=${30}>30 days</option>
                    <option value=${60}>60 days</option>
                    <option value=${90}>90 days</option>
                </select>
                </div>
                <br>
                <button id="paybtn" onclick="pay(${_product.uuid})">Pay ${30*_product.price}</button>
                <button onclick="msgbox.hide()">close</button>
            </div>
        `);
        var cmts="";
        for(const i in _comments){
            const _cmt=_comments[i];
            cmts+=`
            <div class="ele">
                <img src=${_cmt.imgurl}>
                <div class="cmt">
                    <div class="name">${_cmt.name} ${_cmt.namel}</div>
                    ${_cmt.value}
                </div>
            </div>
            `;
        }
        App.sethtml(`
        <div class="dfc d full">
            <div class="gbox class">
                <div class="dfc chmedia">
                    <img src=${_product.image} alt="">
                    <div class="dfcc">
                        <div class="data">Category : ${Caps(_product.cat)}</div>
                        <div class="data">Brand : ${Caps(_product.brand)}</div>
                        <div class="data">Year of Manufacture : ${_product.yof}</div>
                        <div class="data">Charateristics : ${Caps(_product.chars)}</div>
                        <div class="data">Status : ${_product.status==1?"Available":"Not Available"}</div>
                    </div>
                </div>
                <div class="data">Rent Price/day : ${_product.price}</div>
                <div class="data">Over due Price/day : ${_product.price_o}</div>
                
                ${
                    _product.status==0?`
                        ${
                            _user.uuid=User.get().uuid?
                                statusofprdct(_user,_product,_rent)
                            :`<button onclick="Home()">Home</button>`
                        }
                    `:`<button onclick="msgbox.show()">Get</button>`
                }
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
    })
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
    data.append('product_id',currentproductid);
    Post(url, data, (response)=>{
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        ShowProduct(currentproductid);
    });
    cmt_btn.innerHTML="";
    _inp.value="";
}
function statusofprdct(user,prdct,rent){
    const _date=new Date(Number(rent.startdate)).getTime();
    const _day=Math.floor(_date/(1000*60*60*24));
    const _cur=Math.floor((new Date().getTime())/(1000*60*60*24));
    const maxdif=Number(rent.days);
    const dif=_cur-_day;
    if(dif<maxdif){
        return `<button>${maxdif-dif} days left</button>`;
    }
    if(dif==maxdif){
        msgbox.sethtml(`
            <div class="gbox pop">
                <div class="head">${Caps(prdct.cat)}</div>
                <br>
                <button id="paybtn" onclick="return_prdct(${rent.uuid},${rent.product_id},${rent.startdate})">Pay ${30*_product.price}</button>
                <button onclick="msgbox.hide()">close</button>
            </div>
        `);
        return `<button onclick="msgbox.show()">Return</button>`;
    }
    if(dif>maxdif){
        const _payval=(dif-maxdif)*prdct.price_o;
        msgbox.sethtml(`
            <div class="gbox pop">
                <div class="head">${Caps(prdct.cat)}</div>
                <br>
                <button id="paybtn" onclick="return_prdct(${rent.uuid},${rent.product_id},${rent.startdate})">Pay ${_payval}</button>
                <button onclick="msgbox.hide()">close</button>
            </div>
        `);
        return `<button onclick="msgbox.show()">Pay ${_payval}</button>`;
    }
}
function return_prdct(_uuid,prdct,startdate){
    const _date=new Date(Number(startdate)).getTime();
    const _day=Math.floor(_date/(1000*60*60*24));
    const _cur=Math.floor((new Date().getTime())/(1000*60*60*24));
    const dif=_cur-_day;
    console.log("dif is "+dif);
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'rent_return');
    data.append('uuid',_uuid);
    data.append('retdate',dif);
    Post(url, data,(dat)=>{
        console.log(dat);
        ShowProduct(prdct);
        msgbox.hide();
    })

}
function updatestatus(){
    getallproducts(data=>{
        console.log(data);
        const _prdcts=JSON.parse(data);
        var _html="";
        for(const i in _prdcts){
            const _prdct=_prdcts[i];
            _html+=`
            <div class="pbox">
                <div class="iwrap dfc" onclick="ShowProduct(${_prdct.uuid})">
                    <img src=${_prdct.image} alt="No image uploaded">
                </div>
                <div class="name">${_prdct.cat}</div>
                ${_prdct.status==1?`
                    <div class="name">status : Available</div>
                    <button onclick="setstatus(${_prdct.uuid},0)">Make Unavailable</button>
                `:`
                    <div class="name">status : Not Available</div>
                    <button onclick="setstatus(${_prdct.uuid},1)">Make Available</button>
                `}
            </div>`;
        }
        App.sethtml(`
        <div class="products">
            ${_html==""?`
                <h3>No products are here</h3>
            `:``}
            ${_html}
        </div>
        `);
        SideBar.hide();
    })
}
function setstatus(uuid,sta){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'setstatus');
    data.append('adminuuid',User.get().uuid);
    data.append('uuid',uuid);
    data.append("sta",sta);
    Post(url, data,(dat)=>{
        console.log(sta+" : Result is : " +dat);
        updatestatus();
    })
}
function pay(val){
    const _days=document.getElementById("payabt").value;
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'rent');
    data.append('user_id',User.get().uuid);
    data.append('product_id',val);
    data.append("days",_days);
    data.append('retdate',0);
    data.append("startdate",new Date().getTime());
    Post(url, data,(dat)=>{
        console.log(dat);
        ShowProduct(val);
        msgbox.hide();
    })
}
function changepayval(){
    const val=document.getElementById("payabt").value;
    document.getElementById("paybtn").innerHTML="Pay "+val;
}
function Caps(_str) {
    var string = _str;
    return string[0].toUpperCase()+string.slice(1);
}
function Rents(){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'rent_dets');
    data.append('user_id',User.get().uuid);
    Post(url, data,(dat)=>{
        const _prdcts=JSON.parse(dat);
        var _html="";
        for(const i in _prdcts){
            const _prdct=_prdcts[i];
            _html+=`
            <div class="pbox" onclick="ShowProduct(${_prdct.uuid})">
                <div class="iwrap dfc">
                    <img src=${_prdct.image} alt="No image uploaded">
                </div>
                <div class="name">${_prdct.cat}</div>
            </div>`;
        }
        App.sethtml(`
        <div class="products">
            ${_html==""?`
                <h3>No products are here</h3>
            `:``}
            ${_html}
        </div>
        `);
        SideBar.hide();
    })
}
function listall(){
    var url = siteurl + "main.php";
    var data = new FormData();
    data.append('status', 'getallproducts_fd');
    Post(url, data,(data)=>{
        console.log(data);
        const _prdcts=JSON.parse(data);
        console.log(_prdcts);
        var avails=[];
        var nonavails=[];
        var overdues=[];
        for(const i in _prdcts){
            const _prdct=_prdcts[i];
            if(_prdct.status==1)
                avails.push(_prdct);
            else{
                console.log(i);
                const rent=_prdct.rent;
                const _date=new Date(Number(rent.startdate)).getTime();
                const _day=Math.floor(_date/(1000*60*60*24));
                const _cur=Math.floor((new Date().getTime())/(1000*60*60*24));
                const maxdif=Number(rent.days);
                const dif=_cur-_day;
                if(dif<=maxdif){
                    nonavails.push(_prdct);
                }
                if(dif>maxdif){
                    //const _payval=(dif-maxdif)*prdct.price_o;
                    overdues.push(_prdct);
                }
            }
        }
        console.log(avails,nonavails,overdues);
        console.log("k");
        var a_html="";
        var na_html="";
        var od_html="";
        for(const i in avails){
            const _prdct=avails[i];
            a_html+=`
            <div class="pbox">
                <div class="iwrap dfc" onclick="ShowProduct(${_prdct.uuid})">
                    <img src=${_prdct.image} alt="No image uploaded">
                </div>
                <div class="name">${_prdct.cat}</div>
                <div class="name">status : Available</div>
            </div>`;
        }
        for(const i in nonavails){
            const _prdct=nonavails[i];
            var _name=_prdct.rented_user.name+" "+_prdct.rented_user.namel;
            na_html+=`
            <div class="pbox">
                <div class="iwrap dfc" onclick="ShowProduct(${_prdct.uuid})">
                    <img src=${_prdct.image} alt="No image uploaded">
                </div>
                <div class="name">${_prdct.cat}</div>
                <div class="name">Status : Not Available</div>
                <div class="name">Rented By ${_name}</div>
            </div>`;
        }
        for(const i in overdues){
            const _prdct=overdues[i];
            const rent=_prdct.rent;
            const _date=new Date(Number(rent.startdate)).getTime();
            const _day=Math.floor(_date/(1000*60*60*24));
            const _cur=Math.floor((new Date().getTime())/(1000*60*60*24));
            const maxdif=Number(rent.days);
            const dif=_cur-_day;
            const _payval=(dif-maxdif)*_prdct.price_o;
            var _name=_prdct.rented_user.name+_prdct.rented_user.namel;
            od_html+=`
            <div class="pbox">
                <div class="iwrap dfc" onclick="ShowProduct(${_prdct.uuid})">
                    <img src=${_prdct.image} alt="No image uploaded">
                </div>
                <div class="name">${_prdct.cat}</div>
                <div class="name">Status : Not Available</div>
                <div class="name">Rented By ${_name}</div>
                <div class="name">Overdue By ${dif-maxdif} days</div>
                <div class="name">Additional payment ${_payval} </div>
            </div>`;
        }
        App.sethtml(`
        <div class="products">
            <h2>Available Products</h2>
            ${a_html==""?`
                <h3>No products are available</h3>
            `:``}
            ${a_html}
            <h2>Products rented by users</h2>
            ${na_html==""?`
                <h3>No products are rented</h3>
            `:``}
            ${na_html}
            <h2>Products which are overdue</h2>
            ${od_html==""?`
                <h3>No products are overdued</h3>
            `:``}
            ${od_html}
        </div>
        `);
        SideBar.hide();
    });
}
var lastprdcts;
function searchpage(){
    getallproducts(data=>{
        var categories=[];
        var brands=[];
        var characteristics=[];
        data=JSON.parse(data);
        lastprdcts=data;
        for(const i in data){
            const _prdct=data[i];
            console.log(_prdct);
            categories.push(_prdct.cat);
            brands.push(_prdct.brand);
            characteristics.push(_prdct.chars);
        }
        categories=[... new Set(categories)];
        brands=[... new Set(brands)];
        characteristics=[... new Set(characteristics)];
        var car_html="<option value='all'>All</option>";
        var br_html="<option value='all'>All</option>";
        var char_html="<option value='all'>All</option>";
        for(const i in categories){
            const _val=categories[i];
            car_html+=`<option value=${_val}>${_val}</option>`;
        }
        for(const i in brands){
            const _val=brands[i];
            br_html+=`<option value=${_val}>${_val}</option>`;
        }
        for(const i in characteristics){
            const _val=characteristics[i];
            char_html+=`<option value=${_val}>${_val}</option>`;
        }
        App.sethtml(`
        <div class="dfc full">
            <div class="gbox addclass">
                <div class="wrap_s dfc">
                    <div class="name">Category : </div>
                    <select id="cat_sel">
                        ${car_html}
                    </select>
                </div>
                <div class="wrap_s dfc">
                    <div class="name">Brands : </div>
                    <select id="br_sel">
                        ${br_html}
                    </select>
                </div>
                <div class="wrap_s dfc">
                    <div class="name">Characteristics : </div>
                    <select id="char_sel">
                        ${char_html}
                    </select>
                </div>
                <button onclick="Search()">Go</button>
            </div>
        </div>
        `);
    })
}
function Search(){
    const cat=document.getElementById("cat_sel").value;
    const brand=document.getElementById("br_sel").value;
    const char=document.getElementById("char_sel").value;
    var _prdcts=lastprdcts;
    if(cat!="all"){
        _prdcts=_prdcts.filter(_prdct=>cat==_prdct.cat);
    }
    if(brand!="all"){
        _prdcts=_prdcts.filter(_prdct=>brand==_prdct.brand);
    }
    if(char!="all"){
        _prdcts=_prdcts.filter(_prdct=>char==_prdct.chars);
    }
    var _html="";
    _prdcts=_prdcts.sort((a,b)=>{return a.status<b.status?1:-1});
    for(const i in _prdcts){
        const _prdct=_prdcts[i];
        _html+=`
        <div class="pbox" onclick="ShowProduct(${_prdct.uuid})">
            <div class="iwrap dfc">
                <img src=${_prdct.image} alt="No image uploaded">
            </div>
            <div class="name">${_prdct.cat}</div>
            <div class="name">Status : ${_prdct.status==1?"Available":"Not Available"}</div>
        </div>`;
    }
    App.sethtml(`
        <div class="products">
            <h2>Search Results</h2>
            ${_html==""?`
                <h3>No products are here</h3>
            `:``}
            ${_html}
        </div>
    `);
    SideBar.hide();
}