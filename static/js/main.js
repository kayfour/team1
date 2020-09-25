'use strict';

/****************************************************************************
* Initial setup
****************************************************************************/

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };


var configuration = null;

// var roomURL = document.getElementById('url');
//html 에 있는 객체에 대한 참조를 가져온다. 
var video = document.querySelector('video'); //비디오 
var photo = document.getElementById('photo'); //사진 
var photoContext = photo.getContext('2d');   

// var snapBtn = document.getElementById('snap');
// var sendBtn = document.getElementById('send');
var stopBtn = document.getElementById('stop');
var snapAndSendBtn = document.getElementById('snapAndSend');


var photoContextW;
var photoContextH;

// 버튼에 이벤트 핸들러를 붙인다.  
// snapBtn.addEventListener('click', snapPhoto); //캡처 
//ajax
// sendBtn.addEventListener('click', sendPhoto); //서버로 사진을 보낸다
stopBtn.addEventListener('click', StopPhoto);
snapAndSendBtn.addEventListener('click', snapPhoto);
// Disable send buttons by default.
// sendBtn.disabled = false;


/****************************************************************************
* User media (webcam)
****************************************************************************/
function grabWebCamVideo() {
  console.log('Getting user media (video) ...');
  
  //비동기 모드, 장치에 대한 접근이 허용되면  then 이하가 실행된다.
  //Initializes media stream. 
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true  //비디오만 
  })
  .then(gotStream)  //스트립을 처리할 함수의 주소를 전달한다
  .catch(function(e) {
    alert('getUserMedia() error: ' + e.name);
  });
}

let stopPhoto


/****************************************************************************
* Aux functions, mostly UI-related
****************************************************************************/
let snapphoto="";
function snapPhoto() {
  console.log("**")
  if (snapphoto=="")
  {
    snapphoto = setInterval(get_geo,3000);
  }  //이미 작동중 
  else{
    
    console.log("**" + document.getElementById('interval').value);
    let interval = document.getElementById('interval').value; 
    
    if (interval>=3)
    {
      clearInterval(snapphoto);
      snapphoto = setInterval(get_geo,interval);
    }
  }
}
function StopPhoto()
{
  if (snapphoto!=""){
    clearInterval(snapphoto);
    snapphoto="";
  }
} 

function gotStream(stream) {
  //여기서 스트림을 처리한다 
  console.log('getUserMedia video stream URL:', stream);
  window.stream = stream; // stream available to console
  video.srcObject = stream;
  //비디오가 준비가 되면 이
  video.onloadedmetadata = function() {
    photo.width = photoContextW = video.videoWidth;
    photo.height = photoContextH = video.videoHeight;
    console.log('gotStream with width and height:', photoContextW, photoContextH);
  };
  //how(snapBtn);
}

/****************************************************************************
* KAKAO API 가져오기 START
****************************************************************************/
// 전역변수 선언
var local_lat;
var local_lon;
var local_addr;
var ONOFF = null;

function get_geo(){
  // Check whether browser supports Geolocation API or not
  if (navigator.geolocation) { // Supported
  // To add PositionOptions
  navigator.geolocation.getCurrentPosition(getPosition);
  } else { // Not supported
  alert("Oops! This browser does not support HTML Geolocation.");
  }
}

function getPosition(position)
  {
    local_lon = position.coords.longitude;
    local_lat = position.coords.latitude;    
  
    document.getElementById("Longitude").innerHTML = "Longitude: " + local_lon;
    document.getElementById("Latitude").innerHTML = "Latitude: " + local_lat;
    kakao_api(local_lon, local_lat)

 }


 /***************************************************************************
* KAKAO API 가져오기 END
****************************************************************************/
 function kakao_api(local_lon, local_lat){
  $.ajax({
    type:"POST", 
    headers:{"Authorization": "KakaoAK ee0cf33fb761c2003bf8840f07f8accc"},  // 카카오 API 개인 KEY값
    url:"https://dapi.kakao.com/v2/local/geo/coord2address.json?input_coord=WGS84&x="+local_lon+"&y="+local_lat   // 카카오 API URL
  }).done(function(msg){      // ajax 설정값을 통해 받아온 json 데이터를 msg 변수값에 담아서 받아옮
    console.log(msg.documents["0"]["address"]["address_name"]);   // json 데이터 집합 중에 "address_name" 접근
    local_addr = msg.documents["0"]["address"]["address_name"];   // 변수 할당
    document.getElementById("addr_name").innerHTML = "addr_name: " + local_addr;    // index.html
    sendPhoto(local_lon, local_lat, local_addr);

  }).fail( (xhr, a, errorMsg)=>{
    console.log(errorMsg);
  });
}

// 캡처 시작
function startPhoto() {
  snapAndSendPhoto();
  ONOFF = setInterval(get_geo, 2000);
}
// 캡처 중지
// function stopPhoto() {
//   if(ONOFF != null) {
//       clearInterval(ONOFF);
//   }
// }

function snapAndSendPhoto() {
  get_geo();
}


// ----ajax 받아온 것, kakao_api() 함수에서 실행
function sendPhoto(local_lon, local_lat, local_addr) {
  photoContext.drawImage(video, 0, 0, photo.width, photo.height); //비디오 캡처

  var dataURL = photo.toDataURL();
  $.ajax({
     type: "POST", 
     url:'/save',
     //data: {'date': '20200916', 'time':'1509', 'dron_id':1, 'x':34.50, 'y':100.01, 'address_name':'서울시 양천구', 'img_name': dataURL}    
     data: {'dron_id':1, 'x':local_lon, 'y':local_lat, 'address_name':local_addr, 'img_name': dataURL}  
  }).done(function(msg){ 
     console.log(msg); 
  }).fail((xhr, status, errorThrown)=>{
     console.log(errorThrown);
  });
 
}


function logError(err) {
  if (!err) return;
  if (typeof err === 'string') {
    console.warn(err);
  } else {
    console.warn(err.toString(), err);
  }
}



//출력함수, 이걸 kakao_api안에 sendPhoto 밑에 넣기
function gps_print(local_lon, local_lat){
  document.write(local_lon, local_lat)
}
function address_print(local_addr){
  document.write(local_addr)
}
