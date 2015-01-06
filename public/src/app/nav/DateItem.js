/**
 * Created by James on 2/12/2014.
 */
function DateItem (image,date){
    this.date=date;
    this.image=image;
}
DateItem.prototype={
    get Date(){return this.date;},
    get Image(){return this.image;}
};