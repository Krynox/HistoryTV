/**
 * Created by James on 25/12/2014.
 */
var mongoose = require("mongoose");
var AuthorizationScheme = require("../schemes/authorizationScheme");

var Authorization = mongoose.model('Authorization', AuthorizationScheme,"authorizations");
//model,schema,collection
module.exports = Authorization;