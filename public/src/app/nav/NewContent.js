/**
 * Created by James on 02/12/14.
 */
function NewContent(starttime, teaser, title, text, image) {
    this.starttime = starttime;
    this.teaser = teaser;
    this.title = title;
    this.text = text;
    this.image = image;
}
NewContent.prototype = {
    get Title() {
        return this.title;
    },
    get Text() {
        return this.text;
    },
    get Image() {
        return this.image;
    },
    get StartTime() {
        return this.starttime;
    },
    get Teaser() {
        return this.teaser;
    }
};