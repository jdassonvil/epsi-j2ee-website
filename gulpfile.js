"use strict";

var gulp        = require('gulp');
var gutil       = require('gulp-util');
var browserify  = require('browserify');
var hbsfy       = require('hbsfy');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var streamify   = require('gulp-streamify');
var del         = require('del');
var cssmin      = require('gulp-minify-css');
var less        = require('gulp-less');
var concat      = require('gulp-concat');
var jshint      = require('gulp-jshint');
var stylish     = require('jshint-stylish');
var supervisor  = require('gulp-supervisor');

var distdir = './web/dist/';

var vendorStyles = [
	'./node_modules/bootstrap/dist/css/bootstrap.min.css'
];

var vendorScripts = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js'
];

var nodejsfiles = [
	'./gulpfile.js',
	'./index.js',
	'./api/**/*.js'
];

var webjsfiles = [
	'./web/js/**/*.js'
];


gulp.task('clean', function(cb) {
	del([distdir], cb);
});

gulp.task('weblint', function() {
	return gulp.src(webjsfiles)
    		.pipe(jshint("./web/.jshintrc"))
		.pipe(jshint.reporter(stylish));
});

gulp.task('nodelint', function() {
        return gulp.src(nodejsfiles)
                .pipe(jshint("./api/.jshintrc"))
                .pipe(jshint.reporter(stylish));
});

gulp.task('html', ['clean'], function(){
	return gulp.src(['./web/index.html'])
		.pipe(gulp.dest(distdir));
});

gulp.task('bundle', ['weblint', 'clean'], function(){
	return browserify('./web/js/main.js')
		.transform(hbsfy)
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest(distdir + 'js'));
});

gulp.task('js-vendor', ['clean'], function(){
    return gulp.src(vendorScripts)
        .pipe(concat('vendor.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(distdir + 'js'));
});

gulp.task('less', ['clean'], function(){
	return gulp.src("./web/less/style.less")
		.pipe(less())
		.on('error', gutil.log)
		.pipe(cssmin())
		.pipe(gulp.dest(distdir + 'css'));
 
});

gulp.task('css-vendor', ['clean'], function(){
	return gulp.src(vendorStyles)
		.pipe(concat('vendor.css'))
		.pipe(cssmin())
		.pipe(gulp.dest(distdir + 'css'));
});

gulp.task("run", function() {

    gulp.watch(["./web/less/**/*", "./web/js/**/*", "./web/template/**/*"], ["dist"]) 

    supervisor( "index.js", {
        args: [],
        watch: [ "api" ],
        pollInterval: 500,
        extensions: [ "js", "less", "html" ],
        exec: "node",
        noRestartOn: false,
        forceWatch: true,
        quiet: false
    });
} );

gulp.task('dist', ['js', 'html', 'css']);
gulp.task('css',  ['less', 'css-vendor']);
gulp.task('js',   ['bundle', 'js-vendor']);
