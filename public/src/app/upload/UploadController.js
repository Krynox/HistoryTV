/**
 * Created by James on 15/12/2014.
 */
/**
 * Created by James on 23/11/2014.
 */
(function () {
    "use strict";
    var UploadController = function ($scope, $http,socket) {
        var item,
            itemupload,
            srcvid=document.getElementById('videosource'),
            player=document.getElementById('videoplayer'),
            uploadsshown=false,
            Content,
            uploadboxshown=false,
            uploadbox=$("#UploadBox"),
            uploadcontainer=$("#uploadcontainer"),
            uploadarea=$("#UploadArea"),
            useruploads=$("#useruploads"),
            accountform=$("#accountform"),
            user=$("#user"),
            accountcredentials=$("#accountcredentials"),
            loginlink=$("#loginlink"),
            signuplink=$("#signuplink"),
            username=$('#username'),
            password=$('#password'),
            btnlogin=$("#btnlogin"),
            btnsignup=$("#btnsignup");
        $scope.userUploads=[];
        $scope.uploads=[];
        $scope.message="";
        $scope.error="";
        $scope.loggedClass="notLoggedIn";

        $scope.showUpload=function(){
            if(uploadboxshown===false)
            {

                Content='<label for="FileBox">Choose a file: </label><input type="file" id="FileBox"><br>';
                Content+='<label for="NameBox">Name: </label><input type="text" id="NameBox"><br>';
                Content+='<button type="button" id="UploadButton" class="Button">Upload</button>';
                document.getElementById('UploadArea').innerHTML = Content;
                uploadbox.stop().animate({
                    height:"175px"
                },500);
                uploadcontainer.stop().animate({
                    height:"100%"
                },500,function(){
                    uploadarea.css({"display":"block","opacity":"0"});
                });

                uploadarea.stop().animate({
                    opacity:1
                },500);
                uploadboxshown=true;
                authorizeUpload();
            }else{
                uploadarea.stop().animate({
                    opacity:0
                },500,function(){
                    //$("#UploadArea").css({"display":"none"});

                });
                uploadbox.stop().animate({
                    height:"0px"
                },500);
                uploadcontainer.stop().animate({
                    height:"0px"
                },500);
                uploadboxshown=false;
            }

        };
        $scope.showUserUploads=function(){

            if(uploadsshown===false)
            {
                useruploads.stop().animate({
                    "height":($scope.userUploads.length/4*100)+150+"px",
                    "opacity":1
                },1000);
                uploadsshown=true;
            }else{

                useruploads.stop().animate({
                    "height":"0px",
                    "opacity":0
                },1000);
                uploadsshown=false;
            }
        };

        var isUserLoggedIn=function(response){
            if(response.data.user==="User Autheticated")
            {

                accountform.hide();
                accountcredentials.show();
                user.text(getCookie("username"));
                loginlink.hide();
                signuplink.hide();
                getFilesUser();
                $scope.loggedClass="loggedIn";
            }else
            {
                accountform.show();
                accountcredentials.hide();
                loginlink.show();
                signuplink.show();
                $scope.loggedClass="noLoggedIn";
            }
            uploadbox.css({"height":"0%"});
            useruploads.css({"height":"0px","opacity":"0"});
            document.cookie="auth.sid=";
        };

        function setCookie(cname, cvalue) {

            document.cookie = cname + "=" + cvalue ;
        }
        function getCookie(c_name){
            var i,x,y,ARRcookies=document.cookie.split(";");

            for (i=0;i<ARRcookies.length;i++)
            {
                x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
                y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                x=x.replace(/^\s+|\s+$/g,"");
                if (x==c_name)
                {
                    return unescape(y);
                }
            }
        }
        function authorizeUpload(){
            $.ajax({
                type:'POST',
                url:'/authorizeupload',
                success:function(result){
                    if(result.key!=="Autorization Failed")
                    {
                        document.cookie="auth.sid="+result.key;
                        videoUpload.init();
                    }
                }
            });
        }

        var onError = function (response) {
            console.log(response);
        };

        var fillFilesUser=function(response){
            $scope.userUploads=[];
            angular.forEach(response.data, function (value, key) {
                item = new Upload(value.name,value.fileLocation,value.uploadedFrom,value.Views);
                $scope.userUploads.push(item);
            });
        };
        var getFilesUser=function(){
            $http.post("/getuseruploads").then(fillFilesUser, onError);
        };
        var fillRandomFiles=function(response){
            angular.forEach(response.data, function (value, key) {
                //filename,filelocation,location,views
                itemupload = new Upload(value.name,value.fileLocation,value.uploadedFrom,value.Views);
                $scope.uploads.push(itemupload);
            });
        };
        var getRandomFiles=function(){
            $http.post("/getrandomuploads").then(fillRandomFiles, onError);
        };
        $scope.changeVideo=function(vidlink){
            if(srcvid.getAttribute("src")!==vidlink){
                socket.emit('View', { 'uploadlocation' : vidlink});
                player.pause();
                srcvid.setAttribute("src",vidlink);
                player.load();
                player.oncanplay=function(){
                    player.play();
                    canvasDrawer.init();
                };
            }

        };
        var userLoggedIn=function(response){
            if(response.data.info==="Logged In"){
                setCookie("username",username.val());
                accountform.hide();
                accountcredentials.show();
                user.text(username.val());
                loginlink.hide();
                signuplink.hide();
                $scope.loggedClass="loggedIn";
                getFilesUser();
                $scope.error="";
                $scope.message="";
            }else{
                if(response.data.info.message){
                    $scope.error=response.data.info.message;
                }else{
                    $scope.error=response.data.info;
                }
            }
        };
        $scope.login=function(){
            $http.post("/login",{username: $('#username').val(), password: $('#password').val()}).then(userLoggedIn, onError);
        };

        var onUserSignedUp=function(response){
            if(response.data.signed===true){
                $scope.message=response.data.info;
                accountform.hide();
            }else
            {
                if(response.data.info)
                {
                    if(response.data.info.message){
                        $scope.error=response.data.info.message;
                    }else
                    {
                        $scope.error=response.data.info;
                    }

                }
            }
        };
        $scope.signup=function(){
            $http.post("/signup",{username:username.val(), password: password.val()}).then(onUserSignedUp, onError);
        };
        $scope.showLogin=function(){
            btnsignup.hide();
            $scope.message="";
            $scope.error="";
            btnlogin.show();
            accountform.show();
            accountcredentials.hide();
            username.val("");
            password.val("");
        };
        $scope.showSignup=function(){
            $scope.message="";
            $scope.error="";
            btnsignup.show();
            btnlogin.hide();
            accountform.show();
            accountcredentials.hide();
            username.val("");
            password.val("");
        };
        var onLogout=function(response){/**/
            if(response.data.info==="Logged Out"){
                setCookie("username","");
                loginlink.show();
                signuplink.show();
                accountcredentials.hide();
                document.cookie="auth.sid=";
                $scope.userUploads=[];
                $scope.loggedClass="notLoggedIn";
            }
        };
        $scope.logout=function(){
            $http.post("/logout").then(onLogout, onError);
        };
        socket.on('Done', function (data){
            getFilesUser();
        });
        socket.on('viewAdded', function (data){
            angular.forEach($scope.uploads, function (value, key) {
                if(value.filelocation===data.Response){
                    value.views=parseInt(value.views)+1;
                }
            });
            angular.forEach($scope.userUploads, function (value, key) {
                if(value.filelocation===data.Response){
                    value.views=parseInt(value.views)+1;
                }
            });
        });
        $http.post("/isloggedin").then(isUserLoggedIn, onError);
        getRandomFiles();

    };
    var app = angular.module("app");

    app.factory('socket', function ($rootScope) {
        var socket = io.connect("http://"+window.location.hostname+":3001");
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    });

    app.controller("UploadController", ["$scope", "$http","socket", UploadController]);
})();
