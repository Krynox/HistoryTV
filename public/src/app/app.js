/**
 * Created by James on 25/11/14.
 */
(function(){
    "use strict";
    var app= angular.module("app",[]);

    document.addEventListener('DOMContentLoaded', function () {
        var v = document.getElementById('videoplayer'),
        tvimg=document.getElementById('tvimg'),
        canvas = document.getElementById('videocanvas'),vidStatus=true;
        Modernizr.load({
            test: Modernizr.classlist,
            nope: {'poly':'/src/scripts/classlist-polyfill.js'},
            callback:{
                'poly':function(url,result,key){
                    StaticGen.init('#effectcanvas', {
                        tileWidth     : canvas.clientWidth,
                        tileHeight    : canvas.clientHeight,
                        totalFrames   : 4,
                        fps           : 15,
                        pixelWidth    : 1,
                        pixelHeight   : canvas.clientHeight,
                        stretchH      : 8,
                        stretchV      : 1,
                        scanLines     : true,
                        randomizeRows : true
                    });
                    v.volume=0.1;
                    v.load();
                    v.play();
                    canvasDrawer.init();
                }
            }
        });
        if(Modernizr.classlist){
            StaticGen.init('#effectcanvas', {
                tileWidth     : canvas.clientWidth,
                tileHeight    : canvas.clientHeight,
                totalFrames   : 4,
                fps           : 15,
                pixelWidth    : 1,
                pixelHeight   : canvas.clientHeight,
                stretchH      : 8,
                stretchV      : 1,
                scanLines     : true,
                randomizeRows : true
            });
            v.volume=0.1;
            v.load();
            v.play();
            canvasDrawer.init();
        }
        v.addEventListener("play",function(){
            vidStatus=true;
        });
        v.addEventListener("pause",function(){
            vidStatus=false;
        });
        tvimg.addEventListener("click",function(){
            if(vidStatus){
                v.pause();
                vidStatus=false;
            }else{
                v.play();
                vidStatus=true;
                canvasDrawer.init();
            }
        });

        getLocation();
        function getLocation(){
            document.cookie="location=The Void";
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(savePosition);
            }
        }
        function savePosition(position) {
            $.ajax({
                type:'GET',
                url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+","+position.coords.longitude,
                success:function(result){
                    if(result.results.length>=2)
                    {
                        if(result.results[2].formatted_address!==undefined)
                        {
                            document.cookie="location="+result.results[2].formatted_address;
                        }
                        else{
                            document.cookie="location=The Void";
                        }
                    }

                }
            });
        }
    }, false);
})();