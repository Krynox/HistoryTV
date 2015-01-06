/**
 * Created by James on 02/12/14.
 */
function OldContent(title,timeYear,text,image){
    this.title=title;
    this.timeYear=timeYear;
    this.text=text;
    this.image=image;
}
OldContent.prototype={
    get Title(){return this.title;},
    get TimeYear(){return this.timeYear;},
    get Text(){return this.text;},
    get Image(){return this.image;}
};