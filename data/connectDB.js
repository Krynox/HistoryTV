/**
 * Created by James on 16/12/14.
 */
var mongoose = require("mongoose");
var mongodbURL = process.env.CUSTOMCONNSTR_MONGOLAB_URI;

module.exports = (function () {
    var db = mongoose.connect(mongodbURL);
    mongoose.connection.on("open", function () {
        console.log("connection met mongo server" + mongodbURL);
        mongoose.connection.db.collectionNames(function (err, names) {
            console.log("collection list");
            console.log(names);
        });

    })
})();