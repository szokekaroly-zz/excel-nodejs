'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', ['watch']);

gulp.task('jquery', function() {
    return gulp.src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('public/js/'));
});

gulp.task('jshint', function() {
    return gulp.src('/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(jshint.reporter('fail'));        
});

gulp.task('build', ['jquery']);

gulp.task('watch', function() {
    gulp.watch('/**/*.js', ['jshint']);
});