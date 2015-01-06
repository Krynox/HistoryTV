/**
 * Created by James on 02/12/14.
 */
function TimeLineItem(startDate,endDate){
    this.startDate=startDate;
    this.endDate=endDate;
    this.dates=[];
    this.image=[];
}
TimeLineItem.prototype={
    get StartDate(){return this.startDate;},
    get EndDate(){return this.endDate;},
    get Dates(){return this.dates;},
    addDate: function (d,i){
        this.dates.push(new DateItem(i,d));
    },
    addImage:function (v){this.image.push(v);}
};