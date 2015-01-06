/**
 * Created by James on 16/12/14.
 */
var mongoose = require('mongoose');
var UploadScheme = new mongoose.Schema({
    name: {type: String, unique: true},
    username: {type: String},
    fileLocation: {type: String, index: true},
    uploadedFrom: String,
    createdOn: {type: Date, 'default': Date.now},
    Views:{type: String, index: true,'default':0}
});
module.exports=UploadScheme;