/**
 * Created by James on 26/12/2014.
 */
function Upload (filename,filelocation,location,views){
    this.filename=filename;
    this.filelocation=filelocation;
    this.location=location;
    this.views=views;
}
Upload.prototype={
    get Filename(){return this.filename;},
    get Filelocation(){return this.filelocation;},
    get UserLocation(){return this.location;},
    get FileViews(){return this.views;}
};