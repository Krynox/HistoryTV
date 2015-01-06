var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport=require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var User= require("./data/models/user");
var bCrypt=require('bcryptjs');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var signature=require('cookie-signature');
var fs = require('fs');
var server = require('http').createServer(express);
var io = require('socket.io').listen(server);
var Authorization=require('./data/models/authorization');
var Uploads=require('./data/models/upload');
var Converter= require('./converters/binaryConverter');
var Files={};
server.listen(3001);

var connectDB=require("./data/connectDB.js");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'nodeCode'}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/users', users);

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

passport.use('login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        // check in mongo if a user with username exists or not
        User.findOne({ 'username' :  username },
            function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Username does not exist, log error & redirect back
                if (!user){
                    console.log('User Not Found with username '+username);
                    return done(null, false,'User Not found.');
                }
                // User exists but wrong password, log the error
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false,
                        'Invalid Password');
                }
                // User and password both match, return user from
                // done method which will be treated like success
                return done(null, user);
            }
        );
    }));

passport.use('signup', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        findOrCreateUser = function(){
            // find a user in Mongo with provided username
            User.findOne({'username':username},function(err, user) {
                // In case of any error return
                if (err){
                    console.log('Error in SignUp: '+err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log('User already exists');
                    return done(null, false,
                       'User Already Exists');
                } else {
                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = createHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err){
                            console.log('Error in Saving user: '+err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newUser);
                    });
                }
            });
        };
        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    }
));

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary ;
}

io.on('connection', function (socket) {
    var username,
        location;
    socket.on('Start', function (data) {
        if (socket.handshake && socket.handshake.headers && socket.handshake.headers.cookie) {
            var raw = cookie.parse(socket.handshake.headers.cookie)["auth.sid"];
            if (raw) {
                console.log(raw);
                Authorization.findOne({key:raw},function(err,user){
                    if(!err && user!=null)
                    {
                        username=user.username;
                        socket.emit('Authorized');
                        return true;
                    }else{
                        return false;
                    }
                });
            }else
            {
                return false;
            }
        }
    });
    socket.on('StartUpload',function(data){
        var Name = data['Name'];
        Files[Name] = {
            FileSize : data['Size'],
            Data     : "",
            Downloaded : 0
        }
        var Place = 0;
        try{
            var Stat = fs.statSync('Temp/' +  Name);
            if(Stat.isFile())
            {
                Files[Name]['Downloaded'] = Stat.size;
                Place = Stat.size / 524288;
            }
        }
        catch(er){} //It's a New File
        fs.open("Temp/" + Name, "a", 0755, function(err, fd){
            if(err)
            {
                console.log(err);
            }
            else
            {
                Files[Name]['Handler'] = fd;
                socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
            }
        });
    });
    socket.on('View',function(data){
        Uploads.findOne({fileLocation: data.uploadlocation},function(err,response){
            Uploads.update({fileLocation: data.uploadlocation}, {
                Views: parseInt(response.Views)+1+""
            }, function(err, numberAffected, rawResponse) {
                io.sockets.emit("viewAdded",{'Response':response.fileLocation});
            })
        });
    });
    socket.on('Upload', function (data){
        var Name = data['Name'];
        Files[Name]['Downloaded'] += data['Data'].length;
        Files[Name]['Data'] += Converter.BufferToBinaryString(data['Data']);
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize'])
        {
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                var inp = fs.createReadStream("Temp/" + Name);
                var filename=username+"-"+new Date().getSeconds()+"-"+Name;
                var out = fs.createWriteStream("../public/video/" + filename);
                inp.pipe(out);
                inp.on('end',function(){
                    fs.unlink("Temp/" + Name, function () {
                        if (socket.handshake && socket.handshake.headers && socket.handshake.headers.cookie) {
                            var raw = cookie.parse(socket.handshake.headers.cookie)["location"];
                            if (raw) {
                                location=raw;
                            }
                        }
                        Authorization.findOne({key:raw}).remove();
                        Uploads.create({name:Name,username:username,fileLocation:"/video/"+filename,uploadedFrom:location},function(err){
                            if(!err)
                            {
                                socket.emit('Done',{"Name":filename});
                            }
                        });
                    });
                });
            });
        }
        else if(Files[Name]['Data'].length > 10485760){
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                Files[Name]['Data'] = "";
                var Place = Files[Name]['Downloaded'] / 524288;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
            });
        }
        else
        {
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        }    });

});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
