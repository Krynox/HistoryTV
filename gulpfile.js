/**
 * Created by James on 5/01/2015.
 */
var gulp =require('gulp'),
    uglify = require('gulp-uglify'),
    jshint=require('gulp-jshint'),
    concat=require('gulp-concat'),
    minifycss=require('gulp-minify-css');
gulp.task('scripts',function(){
    return gulp.src('public/src/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify({"mangle":false}))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build'));
});
gulp.task('css',function(){
    return gulp.src('public/styles/global.css')
        .pipe(minifycss())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('build'));
})