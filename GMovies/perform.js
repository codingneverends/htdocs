function ShowPerformPage(res) {
    const _movies = res.movies;
    const _theatres = res.theatres;
    var movies_opts = "";
    var theatres_opts = "";
    for (var key in _movies)
        movies_opts += `<option value=${_movies[key].uuid}>${_movies[key].title}</option>`;
    for (var key in _theatres)
        theatres_opts += `<option value=${_theatres[key].uuid}>${_theatres[key].name}</option>`;
    App.innerHTML = `
            <div class="perform wrap">
                <div class="perform wrapb">
                    <h3>New Perfomance</h3>
                    <div class="dff">            
                        <label for="theatres">Theatre </label>
                        <select id="theatres">
                            ${theatres_opts}
                        </select>
                    </div>
                    <div class="dff">            
                        <label for="movies">Movie </label>
                        <select id="movies">
                            ${movies_opts}
                        </select>
                    </div>
                    <p>Start Date and Time</p>
                    <input type="date" id="p_date">
                    <input type="time" id="p_time">
                    <input type="number" id="duration" placeholder="Duration">
                    <input type="number" id="price" placeholder="Price">
                    <i class="fa fa-plus-circle" onclick="AddPerformance()"></i>
                </div>
                <div class="perform wrapb">
                    <h3>Add New Theatre</h3>
                    <input type="text" id="theatre" placeholder="Threatre Name">
                    <input type="number" id="noseats" placeholder="No of Seats">
                    <i class="fa fa-plus-circle" onclick="AddTheatre()"></i>
                </div>
            </div>
    `;
    Topbar.SideBar(false);
}

function Perfomance() {
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'getforshow');
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        ShowPerformPage(response);
    });
}

function AddPerformance() {
    const _theatre = document.getElementById("theatres").value;
    const _movie = document.getElementById("movies").value;
    const date = document.getElementById("p_date").value;
    const time = document.getElementById("p_time").value;
    const duration = document.getElementById("duration").value;
    const price = document.getElementById("price").value;
    const timestamp = Date.parse(date + " " + time);
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'regnewshow');
    data.append('uuid', user.get().uuid);
    data.append('theatre_id', _theatre);
    data.append('movie_id', _movie);
    data.append('starttime', timestamp);
    data.append('duration', duration);
    data.append('price', price);
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        Perfomance();
    });
}

function AddTheatre() {
    const theatre = document.getElementById("theatre").value;
    const noseats = Number(document.getElementById("noseats").value);
    if (theatre.length < 1 || noseats == NaN)
        return;
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'addnewtheatre');
    data.append('uuid', user.get().uuid);
    data.append('name', theatre);
    data.append('noseats', noseats);
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        Perfomance();
    });
    document.getElementById("theatre").value = "";
    document.getElementById("noseats").value = 0;
}

function gettheatres(_movie, movie_name) {
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'gettheatres');
    data.append('movie_id', _movie);
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        ShowPopUpSelectTheatre(response, movie_name);
    });
}

function ShowPopUpSelectTheatre(theatres, movie_name) {
    if (theatres.length == 0) {
        PopUP.show(
            `
            <div class="wrap">
                <h6><i class="fa fa-times-circle" aria-hidden="true" onclick="PopUP.hide()"></i></h6>
                <h3>Movie : ${movie_name}</h3>
                <h3>No Shows Going on</h3>
                <div class="book" onclick="PopUP.hide()">OK</div>
            </div>
            `
        );
        return;
    }
    var theatre_opts = "";
    for (var key in theatres) {
        var starttime = new Date(Number(theatres[key].starttime));
        starttime = starttime.toLocaleDateString() + " " + starttime.toLocaleTimeString();
        theatre_opts += `<option value='${theatres[key].perfomance_id}'>${theatres[key].name} <br> (${starttime})</option>`;
        movie_id = theatres[key].movie_id;
    }
    PopUP.show(
        `
        <div class="wrap">
            <h6><i class="fa fa-times-circle" aria-hidden="true" onclick="PopUP.hide()"></i></h6>
            <h3>Movie : ${movie_name}</h3>
            <div class="ele">
                <label for="popup_theatres">Choose Theatre</label>
                <select id="popup_theatres">
                    ${theatre_opts}
                </select>
            </div>
            <div class="book" onclick="BookShow()">Book</div>
        </div>
        `
    );

}

function BookShow() {
    const selected = document.getElementById("popup_theatres").value;
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'getshowdetails');
    data.append('perfomance_id', selected);
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        ShowPage(response);
        PopUP.hide();
    });
}

var lastroominforamtion;

function BookTicketsWarn() {
    var _count = 0;
    for (var i in SEATARRAY) {
        if (SEATARRAY[i] == 2)
            _count++;
    }
    if (_count == 0)
        return;
    PopUP.show(
        `    
        <div class="wrap">
            <h6><i class="fa fa-times-circle" aria-hidden="true" onclick="PopUP.hide()"></i></h6>
            <h3>Confirm</h3>
            <h3>You Have Selceted ${_count} ticket${_count==1?"":"s"}</h3>
            <div class="book" onclick="BookTickets()">Pay ${_count*lastroominforamtion.perfomance.price}</div>
        </div>
        `
    );
}

function BookTickets() {
    PopUP.hide();
    var _seatdata = "";
    for (var i in SEATARRAY) {
        if (SEATARRAY[i] == 2) {
            if (_seatdata == "") {
                _seatdata = i.split("_")[1];
            } else {
                _seatdata += "-" + i.split("_")[1];
            }
        }
    }
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'bookshow');
    data.append('perfomance_id', lastroominforamtion.perfomance.uuid);
    data.append('seats', _seatdata);
    data.append('user_id', user.get().uuid);
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        var url = baseurl + "php/links.php";
        var data = new FormData();
        data.append('status', 'getshowdetails');
        data.append('perfomance_id', lastroominforamtion.perfomance.uuid);
        Post(url, data, (response) => {
            console.log(response);
            response = JSON.parse(response);
            console.log(response);
            ShowPage(response);
        });
    });
}

function ShowPage(data) {
    lastroominforamtion = data;
    const _theatre = data.theatre;
    const _perfomance = data.perfomance;
    const _movie = data.movie;
    const _seats = data.seats;
    var _date = new Date(Number(_perfomance.starttime));
    var totalseats = _theatre.noseats;
    var seatshtml = "";
    var _available = totalseats;
    var _bookedseats = 0;
    var _yourbookedseats = 0;
    for (var i = 0; i < totalseats; i++) {
        SEATARRAY["seat_" + (i + 1)] = -1;
    }
    for (var i in _seats) {
        console.log(i, _seats[i]);
        var _ar = _seats[i].seats.split("-");
        for (var j in _ar) {
            _available--;
            _bookedseats++;
            var _index = _ar[j];
            SEATARRAY["seat_" + _index] = 0;
            if (user.get().uuid == _seats[i].user_id) {
                _yourbookedseats++;
                SEATARRAY["seat_" + _index] = 1;
            }
        }
    }
    for (var i = 0; i < totalseats; i++) {
        var _color = "#fff";
        var _index = "seat_" + (i + 1);
        if (SEATARRAY[_index] == 0)
            _color = "#f00";
        if (SEATARRAY[_index] == 1)
            _color = "#0f0";
        seatshtml += `<div class='seat' id="seat_${i+1}" style="border-color:${_color}"${SEATARRAY[_index]==-1?`onclick="MarkORUNMark(${i+1})"`:""}>${i+1}</div>`;
    }
    //return html;
    App.innerHTML = `
        <div class="home">
            <div class="smovie" style="background-image: url(${_movie.imgurl});" onclick="getmoviedata(${_movie.uuid})">
                <div class="dum">.</div>
                <div class="title">${_movie.title}</div>
            </div>
            <div class="smovie">
                <div class="title">${_theatre.name}</div>
                <div class="title s">Show on ${_date.toLocaleDateString()} , ${_date.toLocaleTimeString()}</div>
                <div class="title s"><i class="fa fa-ticket" aria-hidden="true"></i> ${_perfomance.price}rs</div>
            </div>
            
            <div class="seats">
                <div class="seat" style="border-color:#f00">${_bookedseats}</div> Total Bookings<br>
                <div class="seat" style="border-color:#0f0">${_yourbookedseats}</div> Yours Booking<br>
                <div class="seat" style="border-color:#fff">${_available}</div> Remaing slots
            </div>
            <div class="seats">
                ${seatshtml}
            </div>
            <div class="book" onclick="BookTicketsWarn()">Book Tickets <i class="fa fa-ticket" aria-hidden="true"></i></div>
        </div>
    `;
}

var SEATARRAY = [];

function MarkORUNMark(index) {
    var val = SEATARRAY["seat_" + index];
    if (val == -1)
        MarkSeatBLUE(index);
    if (val == 2)
        UNMarkSeat(index);
}

function MarkSeatRED(index) {
    document.getElementById("seat_" + index).style.borderColor = "#f00";
    SEATARRAY["seat_" + index] = 0;
}

function MarkSeatBLUE(index) {
    if (SEATARRAY["seat_" + index] != -1)
        return;
    document.getElementById("seat_" + index).style.borderColor = "#00f";
    SEATARRAY["seat_" + index] = 2;
}

function MarkSeatGREEN(index) {
    document.getElementById("seat_" + index).style.borderColor = "#0f0";
    SEATARRAY["seat_" + index] = 1;
}

function UNMarkSeat(index) {
    if (SEATARRAY["seat_" + index] != 2)
        return;
    document.getElementById("seat_" + index).style.borderColor = "#fff";
    SEATARRAY["seat_" + index] = -1;
}

function GetAllBookings(){
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'getallbookings');
    data.append('uuid', user.get().uuid);
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        BookPage(response);
        Topbar.SideBar(false);
    });
}
function BookPage(data){
    var elehtml="";
    for(var i in data){
        var _data=data[i];
        console.log(_data);
        var _tickets=0;
        var seats=_data.bookings.seats.split("-");
        for(i in seats){
            if(Number(seats[i])!=NaN)
                _tickets++;
        }
        var _date=new Date(Number(_data.perfomance.starttime));
        _date=_date.toLocaleDateString()+" , "+_date.toLocaleTimeString();
        elehtml+=`
        <div class="bmovie">
            <div class="ele">
                <img src=${_data.movie.imgurl} onclick="getmoviedata(${_data.movie.uuid})">
            </div>
            <div class="ele">
                <div class="title">${_data.movie.title}</div>
                <div class="title">${_data.theatre.name}</div>
                <div class="title">${_date}</div>
                <div class="title">${_tickets} tickets booked</div>
            </div>
        </div>
        `;
    }
    App.innerHTML=`
    <div class="bookp">
        <div class="tit">Your Bookings</div>
        ${elehtml}
    </div>
    `;
}



function DeleteUser(uuid){
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'deleteuser');
    data.append('uuid', user.get().uuid);
    data.append('user_id',uuid);
    Post(url, data, (response) => {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
    });
}
function DeleteMovie(uuid,callback){
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'deletemovie');
    data.append('uuid', user.get().uuid);
    data.append('movie_id',uuid);
    Post(url, data, (response) => {
        response = JSON.parse(response);
        callback(response);
    });
}
function DeletePerson(uuid,callback){
    var url = baseurl + "php/links.php";
    var data = new FormData();
    data.append('status', 'deleteperson');
    data.append('uuid', user.get().uuid);
    data.append('person_id',uuid);
    Post(url, data, (response) => {
        response = JSON.parse(response);
        callback(response);
    });
}