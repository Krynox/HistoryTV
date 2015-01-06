/**
 * Created by James on 16/12/14.
 */
var mongoose = require("mongoose");
var UserSchema = require("../schemes/userScheme");

var User = mongoose.model('User', UserSchema,"users");
//model,schema,collection
module.exports = User;