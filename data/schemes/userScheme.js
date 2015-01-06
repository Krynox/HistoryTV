var mongoose = require('mongoose');
var UserScheme = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String, index: true},
    createdOn: {type: Date, 'default': Date.now}
});
module.exports=UserScheme;