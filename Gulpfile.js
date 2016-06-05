var gulp = require('gulp');
var util = require('gulp-util');
var browserSync = require('browser-sync').create();

gulp.task('serve', function() {
    var files = [
        'src/*.html',
        'src/app/**/*.js',
        'src/*.css'
    ];

    browserSync.init(files, {
        server: {
            baseDir: ['src'],
            index: 'index.html'
        }
    });

});