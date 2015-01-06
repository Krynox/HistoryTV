/**
 * Created by James on 25/12/2014.
 */
var mongoose = require('mongoose');
var AuthorizationScheme = new mongoose.Schema({
    username: {type: String},
    key: {type: String, index: true}
});
module.exports=AuthorizationScheme;