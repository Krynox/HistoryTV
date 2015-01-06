!function(){"use strict";angular.module("app",[]);document.addEventListener("DOMContentLoaded",function(){function getLocation(){document.cookie="location=The Void",navigator.geolocation&&navigator.geolocation.getCurrentPosition(savePosition)}function savePosition(position){$.ajax({type:"GET",url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude,success:function(result){result.results.length>=2&&(document.cookie=void 0!==result.results[2].formatted_address?"location="+result.results[2].formatted_address:"location=The Void")}})}var v=document.getElementById("videoplayer"),tvimg=document.getElementById("tvimg"),canvas=document.getElementById("videocanvas"),vidStatus=!0;Modernizr.load({test:Modernizr.classlist,nope:{poly:"/src/scripts/classlist-polyfill.js"},callback:{poly:function(){StaticGen.init("#effectcanvas",{tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:4,fps:15,pixelWidth:1,pixelHeight:canvas.clientHeight,stretchH:8,stretchV:1,scanLines:!0,randomizeRows:!0}),v.volume=.1,v.load(),v.play(),canvasDrawer.init()}}}),Modernizr.classlist&&(StaticGen.init("#effectcanvas",{tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:4,fps:15,pixelWidth:1,pixelHeight:canvas.clientHeight,stretchH:8,stretchV:1,scanLines:!0,randomizeRows:!0}),v.volume=.1,v.load(),v.play(),canvasDrawer.init()),v.addEventListener("play",function(){vidStatus=!0}),v.addEventListener("pause",function(){vidStatus=!1}),tvimg.addEventListener("click",function(){vidStatus?(v.pause(),vidStatus=!1):(v.play(),vidStatus=!0,canvasDrawer.init())}),getLocation()},!1)}();
var canvasDrawer=function(){"use strict";var cw,ch,staticcanvas,staticcontext,v=document.getElementById("videoplayer"),canvas=(document.getElementById("tvimg"),document.getElementById("videocanvas")),context=canvas.getContext("2d"),back=document.createElement("canvas"),backcontext=back.getContext("2d"),image=new Image,canvasColor=!1;cw=canvas.clientWidth,ch=canvas.clientHeight,canvas.width=cw,canvas.height=ch,back.width=cw,back.height=ch,image.src="../../images/dirt.png";var init=function(){staticcanvas=document.getElementsByClassName("static"),staticcontext=staticcanvas[0].getContext("2d"),draw(!1)},switchMode=function(switchColor){canvasColor=switchColor},draw=function(){var data,idata=[];if(v&&canvas.width>0){if(v.paused||v.ended)return!1;if(canvasColor===!1){backcontext.drawImage(v,0,0,cw,ch),idata=backcontext.getImageData(0,0,cw,ch),data=idata.data;for(var i=0;i<data.length;i+=4){var r=data[i],g=data[i+1],b=data[i+2],brightness=3*r+4*g+b>>>3;data[i]=brightness,data[i+1]=brightness,data[i+2]=brightness}idata.data.set(data),context.putImageData(idata,0,0)}else context.drawImage(v,0,0,cw,ch);staticcontext.drawImage(image,0,0),setTimeout(draw,20)}};return{init:init,switchMode:switchMode}}();
var videoUpload=function(){"use strict";function init(){socket=io.connect("http://"+window.location.hostname+":3001"),srcvid=document.getElementById("videosource"),player=document.getElementById("videoplayer"),window.File&&window.FileReader?(document.getElementById("UploadButton").addEventListener("click",StartUpload),document.getElementById("FileBox").addEventListener("change",FileChosen)):document.getElementById("UploadArea").innerHTML="Your Browser Doesn't Support The File API Please Update Your Browser",socket.on("MoreData",function(data){UpdateBar(data.Percent);var NewFile,Place=524288*data.Place;NewFile=SelectedFile.slice(Place,Place+Math.min(524288,SelectedFile.size-Place)),FReader.readAsArrayBuffer(NewFile,"utf-16")}),socket.on("Done",function(data){Content="Video Successfully Uploaded !!",document.getElementById("UploadArea").innerHTML=Content,Content="",player.pause(),srcvid.setAttribute("src","video/"+data.Name),player.load(),player.oncanplay=function(){player.play(),canvasDrawer.init()},document.cookie="auth.sid="}),socket.on("Authorized",function(){socket.emit("StartUpload",{Name:Name,Size:SelectedFile.size})})}function FileChosen(evnt){SelectedFile=evnt.target.files[0],document.getElementById("NameBox").value=SelectedFile.name}function StartUpload(){""!==document.getElementById("FileBox").value?(player.pause(),FReader=new FileReader,Name=document.getElementById("NameBox").value,Content="<span id='NameArea'>Uploading "+SelectedFile.name+" as "+Name+"</span>",Content+='<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>',Content+="<span id='Uploaded'> - <span id='MB'>0</span>/"+Math.round(SelectedFile.size/1048576)+"MB</span>",document.getElementById("UploadArea").innerHTML=Content,Content="",FReader.onload=function(evnt){socket.emit("Upload",{Name:Name,Data:evnt.target.result})},socket.emit("Start",{Name:Name,Size:SelectedFile.size})):alert("Please Select A File")}function UpdateBar(percent){document.getElementById("ProgressBar").style.width=percent+"%",document.getElementById("percent").innerHTML=Math.round(100*percent)/100+"%",MBDone=Math.round(percent/100*SelectedFile.size/1048576),document.getElementById("MB").innerHTML=MBDone}var socket,FReader,Name,Content,srcvid,player,MBDone,SelectedFile;return{init:init}}();
function DateItem(image,date){this.date=date,this.image=image}DateItem.prototype={get Date(){return this.date},get Image(){return this.image}};
!function(){"use strict";var NavController=function($scope,$http){var year,item,resizeId,jsonUrl="../../json/tv.json",canvas=document.getElementById("videocanvas"),staticcanvas=document.getElementById("effectcanvas"),newcontentcontainer=$(".newcontent");$scope.item="television",$scope.startYear="1920",$scope.endYear="1930",$scope.items=[],$scope.new=[],$scope.years=[],$scope.changeYear=function(start,end){$scope.startYear=start,$scope.endYear=end,changeFilter(start)},window.onresize=function(){clearTimeout(resizeId),resizeId=setTimeout(changeFilter($scope.startYear),500)};var changeFilter=function(start){switch(start){case"1920":canvasDrawer.switchMode(!1),StaticGen.redraw({tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:10,fps:15,pixelWidth:1,pixelHeight:canvas.clientHeight,stretchH:8,stretchV:1,scanLines:!0,randomizeRows:!0}),staticcanvas.style.opacity="0.8";break;case"1931":canvasDrawer.switchMode(!1),StaticGen.redraw({tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:10,fps:15,pixelWidth:20,pixelHeight:canvas.clientHeight,stretchH:8,stretchV:1,scanLines:!0,randomizeRows:!0}),staticcanvas.style.opacity="0.7";break;case"1941":canvasDrawer.switchMode(!1),StaticGen.redraw({tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:10,fps:15,pixelWidth:20,pixelHeight:canvas.clientHeight,stretchH:8,stretchV:1,scanLines:!0,randomizeRows:!0}),staticcanvas.style.opacity="0.2";break;case"1951":canvasDrawer.switchMode(!1),StaticGen.redraw({tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:10,fps:15,pixelWidth:canvas.clientWidth/2,pixelHeight:canvas.clientHeight,stretchH:8,stretchV:10,scanLines:!0,randomizeRows:!0}),staticcanvas.style.opacity="0.3";break;case"1961":canvasDrawer.switchMode(!0),StaticGen.redraw({tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:10,fps:15,pixelWidth:2,pixelHeight:1,stretchH:8,stretchV:1,scanLines:!0,randomizeRows:!0}),staticcanvas.style.opacity="0.5";break;case"1981":canvasDrawer.switchMode(!0),StaticGen.redraw({tileWidth:canvas.clientWidth,tileHeight:canvas.clientHeight,totalFrames:10,fps:15,pixelWidth:2,pixelHeight:1,stretchH:8,stretchV:1,scanLines:!0,randomizeRows:!0}),staticcanvas.style.opacity="0.1";break;default:canvasDrawer.switchMode(!0),staticcanvas.style.opacity="0"}};$scope.yearFilter=function(item){return item.TimeYear>=$scope.startYear&&item.TimeYear<=$scope.endYear},$scope.timeFilter=function(item){return item.starttime>=$scope.startYear&&item.starttime<=$scope.endYear};var onDataDownloaded=function(response){$scope.items=[],$scope.years=[],angular.forEach(response.data.Items,function(value){year=new TimeLineItem(value.Time.StartTime,value.Time.EndTime),angular.forEach(value.ContentOld,function(value){item=new OldContent(value.Title,value.Time,value.Text,value.Image),year.addDate(value.Time,value.Image),$scope.items.push(item)}),$scope.years.push(year);var newitem=new NewContent(value.Time.StartTime,value.ContentNew.Teaser,value.ContentNew.Title,value.ContentNew.Text,value.ContentNew.Image);$scope.new.push(newitem)})};$scope.showContent=function(){400===newcontentcontainer.height()?($newcontentcontainer.animate({height:50},800),$(".newcontent >div>*").css({opacity:"0",display:"none"})):(newcontentcontainer.css({position:"relative",bottom:"0"}),newcontentcontainer.animate({height:400}),$("html, body").animate({scrollTop:newcontentcontainer.offset().top},500,function(){$(".newcontent >div>*").css({opacity:"0",display:"block"}),$(".newcontent >div>*").animate({opacity:"1"},200)}))};var onError=function(response){console.log(response)};$http.get(jsonUrl).then(onDataDownloaded,onError)},app=angular.module("app");app.controller("NavController",["$scope","$http",NavController])}();
function NewContent(starttime,teaser,title,text,image){this.starttime=starttime,this.teaser=teaser,this.title=title,this.text=text,this.image=image}NewContent.prototype={get Title(){return this.title},get Text(){return this.text},get Image(){return this.image},get StartTime(){return this.starttime},get Teaser(){return this.teaser}};
function OldContent(title,timeYear,text,image){this.title=title,this.timeYear=timeYear,this.text=text,this.image=image}OldContent.prototype={get Title(){return this.title},get TimeYear(){return this.timeYear},get Text(){return this.text},get Image(){return this.image}};
function TimeLineItem(startDate,endDate){this.startDate=startDate,this.endDate=endDate,this.dates=[],this.image=[]}TimeLineItem.prototype={get StartDate(){return this.startDate},get EndDate(){return this.endDate},get Dates(){return this.dates},addDate:function(d,i){this.dates.push(new DateItem(i,d))},addImage:function(v){this.image.push(v)}};
!function(){"use strict";var UploadController=function($scope,$http,socket){function setCookie(cname,cvalue){document.cookie=cname+"="+cvalue}function getCookie(c_name){var i,x,y,ARRcookies=document.cookie.split(";");for(i=0;i<ARRcookies.length;i++)if(x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("=")),y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1),x=x.replace(/^\s+|\s+$/g,""),x==c_name)return unescape(y)}function authorizeUpload(){$.ajax({type:"POST",url:"/authorizeupload",success:function(result){"Autorization Failed"!==result.key&&(document.cookie="auth.sid="+result.key,videoUpload.init())}})}var item,itemupload,Content,srcvid=document.getElementById("videosource"),player=document.getElementById("videoplayer"),uploadsshown=!1,uploadboxshown=!1,uploadbox=$("#UploadBox"),uploadcontainer=$("#uploadcontainer"),uploadarea=$("#UploadArea"),useruploads=$("#useruploads"),accountform=$("#accountform"),user=$("#user"),accountcredentials=$("#accountcredentials"),loginlink=$("#loginlink"),signuplink=$("#signuplink"),username=$("#username"),password=$("#password"),btnlogin=$("#btnlogin"),btnsignup=$("#btnsignup");$scope.userUploads=[],$scope.uploads=[],$scope.message="",$scope.error="",$scope.loggedClass="notLoggedIn",$scope.showUpload=function(){uploadboxshown===!1?(Content='<label for="FileBox">Choose a file: </label><input type="file" id="FileBox"><br>',Content+='<label for="NameBox">Name: </label><input type="text" id="NameBox"><br>',Content+='<button type="button" id="UploadButton" class="Button">Upload</button>',document.getElementById("UploadArea").innerHTML=Content,uploadbox.stop().animate({height:"175px"},500),uploadcontainer.stop().animate({height:"100%"},500,function(){uploadarea.css({display:"block",opacity:"0"})}),uploadarea.stop().animate({opacity:1},500),uploadboxshown=!0,authorizeUpload()):(uploadarea.stop().animate({opacity:0},500,function(){}),uploadbox.stop().animate({height:"0px"},500),uploadcontainer.stop().animate({height:"0px"},500),uploadboxshown=!1)},$scope.showUserUploads=function(){uploadsshown===!1?(useruploads.stop().animate({height:$scope.userUploads.length/4*100+150+"px",opacity:1},1e3),uploadsshown=!0):(useruploads.stop().animate({height:"0px",opacity:0},1e3),uploadsshown=!1)};var isUserLoggedIn=function(response){"User Autheticated"===response.data.user?(accountform.hide(),accountcredentials.show(),user.text(getCookie("username")),loginlink.hide(),signuplink.hide(),getFilesUser(),$scope.loggedClass="loggedIn"):(accountform.show(),accountcredentials.hide(),loginlink.show(),signuplink.show(),$scope.loggedClass="noLoggedIn"),uploadbox.css({height:"0%"}),useruploads.css({height:"0px",opacity:"0"}),document.cookie="auth.sid="},onError=function(response){console.log(response)},fillFilesUser=function(response){$scope.userUploads=[],angular.forEach(response.data,function(value){item=new Upload(value.name,value.fileLocation,value.uploadedFrom,value.Views),$scope.userUploads.push(item)})},getFilesUser=function(){$http.post("/getuseruploads").then(fillFilesUser,onError)},fillRandomFiles=function(response){angular.forEach(response.data,function(value){itemupload=new Upload(value.name,value.fileLocation,value.uploadedFrom,value.Views),$scope.uploads.push(itemupload)})},getRandomFiles=function(){$http.post("/getrandomuploads").then(fillRandomFiles,onError)};$scope.changeVideo=function(vidlink){srcvid.getAttribute("src")!==vidlink&&(socket.emit("View",{uploadlocation:vidlink}),player.pause(),srcvid.setAttribute("src",vidlink),player.load(),player.oncanplay=function(){player.play(),canvasDrawer.init()})};var userLoggedIn=function(response){"Logged In"===response.data.info?(setCookie("username",username.val()),accountform.hide(),accountcredentials.show(),user.text(username.val()),loginlink.hide(),signuplink.hide(),$scope.loggedClass="loggedIn",getFilesUser(),$scope.error="",$scope.message=""):$scope.error=response.data.info.message?response.data.info.message:response.data.info};$scope.login=function(){$http.post("/login",{username:$("#username").val(),password:$("#password").val()}).then(userLoggedIn,onError)};var onUserSignedUp=function(response){response.data.signed===!0?($scope.message=response.data.info,accountform.hide()):response.data.info&&($scope.error=response.data.info.message?response.data.info.message:response.data.info)};$scope.signup=function(){$http.post("/signup",{username:username.val(),password:password.val()}).then(onUserSignedUp,onError)},$scope.showLogin=function(){btnsignup.hide(),$scope.message="",$scope.error="",btnlogin.show(),accountform.show(),accountcredentials.hide(),username.val(""),password.val("")},$scope.showSignup=function(){$scope.message="",$scope.error="",btnsignup.show(),btnlogin.hide(),accountform.show(),accountcredentials.hide(),username.val(""),password.val("")};var onLogout=function(response){"Logged Out"===response.data.info&&(setCookie("username",""),loginlink.show(),signuplink.show(),accountcredentials.hide(),document.cookie="auth.sid=",$scope.userUploads=[],$scope.loggedClass="notLoggedIn")};$scope.logout=function(){$http.post("/logout").then(onLogout,onError)},socket.on("Done",function(){getFilesUser()}),socket.on("viewAdded",function(data){angular.forEach($scope.uploads,function(value){value.filelocation===data.Response&&(value.views=parseInt(value.views)+1)}),angular.forEach($scope.userUploads,function(value){value.filelocation===data.Response&&(value.views=parseInt(value.views)+1)})}),$http.post("/isloggedin").then(isUserLoggedIn,onError),getRandomFiles()},app=angular.module("app");app.factory("socket",function($rootScope){var socket=io.connect("http://"+window.location.hostname+":3001");return{on:function(eventName,callback){socket.on(eventName,function(){var args=arguments;$rootScope.$apply(function(){callback.apply(socket,args)})})},emit:function(eventName,data,callback){socket.emit(eventName,data,function(){var args=arguments;$rootScope.$apply(function(){callback&&callback.apply(socket,args)})})}}}),app.controller("UploadController",["$scope","$http","socket",UploadController])}();
function Upload(filename,filelocation,location,views){this.filename=filename,this.filelocation=filelocation,this.location=location,this.views=views}Upload.prototype={get Filename(){return this.filename},get Filelocation(){return this.filelocation},get UserLocation(){return this.location},get FileViews(){return this.views}};