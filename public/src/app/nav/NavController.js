/**
 * Created by James on 23/11/2014.
 */
(function () {
    "use strict";
    var NavController = function ($scope, $http) {
        var year, item,resizeId,
        jsonUrl = "../../json/tv.json",
        canvas = document.getElementById('videocanvas'),
        staticcanvas = document.getElementById('effectcanvas'),
        newcontentcontainer=$(".newcontent");
        $scope.item = "television";
        $scope.startYear = "1920";
        $scope.endYear = "1930";
        $scope.items = [];
        $scope.new = [];
        $scope.years = [];



        $scope.changeYear = function (start, end) {
            $scope.startYear = start;
            $scope.endYear = end;
            changeFilter(start);

        };

        window.onresize = function(event) {
            clearTimeout(resizeId);
            resizeId = setTimeout(changeFilter($scope.startYear), 500);
        };

        var changeFilter = function (start) {

            switch (start){
                case "1920":
                    canvasDrawer.switchMode(false);
                    StaticGen.redraw({
                        tileWidth     : canvas.clientWidth,
                        tileHeight    : canvas.clientHeight,
                        totalFrames   : 10,
                        fps           : 15,
                        pixelWidth    : 1,
                        pixelHeight   : canvas.clientHeight,
                        stretchH      : 8,
                        stretchV      : 1,
                        scanLines     : true,
                        randomizeRows : true
                    });
                    staticcanvas.style.opacity="0.8";

                    break;
                case "1931":
                    canvasDrawer.switchMode(false);
                    StaticGen.redraw({
                        tileWidth     : canvas.clientWidth,
                        tileHeight    : canvas.clientHeight,
                        totalFrames   : 10,
                        fps           : 15,
                        pixelWidth    : 20,
                        pixelHeight   : canvas.clientHeight,
                        stretchH      : 8,
                        stretchV      : 1,
                        scanLines     : true,
                        randomizeRows : true
                    });
                    staticcanvas.style.opacity="0.7";
                    break;
                case "1941":
                    canvasDrawer.switchMode(false);
                    StaticGen.redraw({
                        tileWidth     : canvas.clientWidth,
                        tileHeight    : canvas.clientHeight,
                        totalFrames   : 10,
                        fps           : 15,
                        pixelWidth    : 20,
                        pixelHeight   : canvas.clientHeight,
                        stretchH      : 8,
                        stretchV      : 1,
                        scanLines     : true,
                        randomizeRows : true
                    });
                    staticcanvas.style.opacity="0.2";
                    break;
                case "1951":
                    canvasDrawer.switchMode(false);
                    StaticGen.redraw({
                        tileWidth     : canvas.clientWidth,
                        tileHeight    : canvas.clientHeight,
                        totalFrames   : 10,
                        fps           : 15,
                        pixelWidth    : canvas.clientWidth/2,
                        pixelHeight   : canvas.clientHeight,
                        stretchH      : 8,
                        stretchV      : 10,
                        scanLines     : true,
                        randomizeRows : true
                    });
                    staticcanvas.style.opacity="0.3";
                    break;
                case "1961":
                    canvasDrawer.switchMode(true);
                    StaticGen.redraw({
                        tileWidth     : canvas.clientWidth,
                        tileHeight    : canvas.clientHeight,
                        totalFrames   : 10,
                        fps           : 15,
                        pixelWidth    : 2,
                        pixelHeight   : 1,
                        stretchH      : 8,
                        stretchV      : 1,
                        scanLines     : true,
                        randomizeRows : true
                    });
                    staticcanvas.style.opacity="0.5";
                    break;
                case "1981":
                    canvasDrawer.switchMode(true);
                    StaticGen.redraw({
                        tileWidth     : canvas.clientWidth,
                        tileHeight    : canvas.clientHeight,
                        totalFrames   : 10,
                        fps           : 15,
                        pixelWidth    : 2,
                        pixelHeight   : 1,
                        stretchH      : 8,
                        stretchV      : 1,
                        scanLines     : true,
                        randomizeRows : true
                    });
                    staticcanvas.style.opacity="0.1";
                    break;
                default:
                    canvasDrawer.switchMode(true);
                    staticcanvas.style.opacity="0";
                    break;
            }
        };

        $scope.yearFilter = function (item) {
            return item.TimeYear >= $scope.startYear && item.TimeYear <= $scope.endYear;
        };

        $scope.timeFilter = function (item) {
            return item.starttime >= $scope.startYear && item.starttime <= $scope.endYear;
        };

        var onDataDownloaded = function (response) {
            $scope.items = [];
            $scope.years = [];
            angular.forEach(response.data.Items, function (value, key) {
                year = new TimeLineItem(value.Time.StartTime, value.Time.EndTime);
                angular.forEach(value.ContentOld, function (value, key) {
                    item = new OldContent(value.Title, value.Time, value.Text, value.Image);
                    year.addDate(value.Time, value.Image);
                    $scope.items.push(item);
                });
                $scope.years.push(year);
                var newitem = new NewContent(value.Time.StartTime, value.ContentNew.Teaser, value.ContentNew.Title, value.ContentNew.Text, value.ContentNew.Image);
                $scope.new.push(newitem);

            });


        };

        $scope.showContent=function(){
            if(newcontentcontainer.height()===400)
            {

                $newcontentcontainer.animate({
                    height:50
                },800);
                $('.newcontent >div>*').css({"opacity":"0","display":"none"});
            }else{
                newcontentcontainer.css({"position":"relative","bottom":"0"});

                newcontentcontainer.animate({
                    height:400
                });
                $('html, body').animate({
                    scrollTop: newcontentcontainer.offset().top
                },500,function(){
                    $('.newcontent >div>*').css({"opacity":"0","display":"block"});
                    $('.newcontent >div>*').animate({
                        opacity:"1"
                    },200);
                });
            }
        };

        var onError = function (response) {
            console.log(response);
        };

        $http.get(jsonUrl).then(onDataDownloaded, onError);

    };
    var app = angular.module("app");
    app.controller("NavController", ["$scope", "$http", NavController]);
})();