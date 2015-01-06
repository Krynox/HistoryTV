/**
 * Created by James on 16/12/14.
 */

var mongoose = require("mongoose");
var UploadSchema = require("../schemes/uploadScheme");
var random = require('mongoose-random');
UploadSchema.plugin(random,{path:'r'});

var Upload = mongoose.model('Upload', UploadSchema,"uploads");
//model,schema,collection
module.exports = Upload;
