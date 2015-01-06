var express = require('express');
var router = express.Router();
var passport =require('passport');
var Authorization=require('../data/models/authorization');
var bCrypt=require('bcryptjs');
var LocalStrategy = require('passport-local').Strategy;
var Uploads=require('../data/models/upload');

function createKey(username)
{
    return bCrypt.hashSync(username+Math.floor((Math.random() * 10) + 1), bCrypt.genSaltSync(10), null);
}
/* GET home page. */
router.get("/offline.manifest", function(req, res){
    res.header("Content-Type", "text/cache-manifest");
    res.end("CACHE MANIFEST");
});
router.get('/', function(req, res) {
  res.render('./public/index.html');
});
router.post('/getuseruploads',function(req,res){
   if(req.isAuthenticated()){
       Uploads.find({username:req.user.username},function(err,data){
          console.log(data);
           return res.json(data);
       });
   }
});
router.post('/getrandomuploads',function(req,res){
    Uploads.syncRandom(function (err, result) {
        console.log(result.updated);
    });
    Uploads.findRandom().limit(4).exec(function (err, data) {
        if(!err){
            res.json(data);
        }

    });
});
router.post('/addview', function (req,res) {
    Uploads.findOne({fileLocation: req.body.uploadlocation},function(err,data){
        Uploads.update({fileLocation: req.body.uploadlocation}, {
            Views: parseInt(data.Views)+1+""
        }, function(err, numberAffected, rawResponse) {
            res.json(rawResponse);
        })
    });

})
router.post('/authorizeupload',function(req,res){
    if(req.isAuthenticated()){
        var key=createKey(req.user.username)
        var a={username:req.user.username,key:key};
        Authorization.create(a, function (err) {
            //via het model
            if (err) {
                console.log(err);
                Authorization.findOne({username:req.user.username},function(err,user){
                    if(!err)
                    {
                        console.log(user);
                        return res.json({key:user.key});
                    }else{
                        return res.json({key: "Autorization Failed"});
                    }
                });
            }else
            {
                Authorization.findOne({username:req.user.username},function(err,user){
                    if(!err)
                    {
                        console.log(user);
                        return res.json({key:user.key});
                    }else{
                        return res.json({key: "Autorization Failed"});
                    }
                });
                return res.json({key: key});
            }

        });
    }
});

router.post('/isloggedin',function(req,res){
    if(req.isAuthenticated()){
        console.log(req.user.username);
        return res.json({user: "User Autheticated"});
    }
});

router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(err, user, info) {
        if (!user) { return res.json({info: info}); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json({info: "Logged In"});
        });
        if (err) {
            return next(err); }
    })(req, res, next);
});

router.post('/logout', function logout(req, res){
    if(req.isAuthenticated()){
        req.session.destroy();
        req.logout();
        res.json({info:"Logged Out"})
    }
});

router.post('/signup', function(req, res, next) {
    passport.authenticate('signup', function(err, user, info) {
        if (!user) { return res.json({info: info,signed:false}); }
        else{
            return res.json({info: "Welcome "+user.username+", you can now login with this account.",signed:true});
        }
        if (err) {
            return next(err); }
    })(req, res, next);
});


module.exports = router;
