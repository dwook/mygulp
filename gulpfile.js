var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    scope: ['dependencies'],
});
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var inquirer = require('inquirer');
var browserSync = require('browser-sync').create();

var errorHandler = function (error) {
	console.error(error.message);
	this.emit('end');
};
var plumberOption = {
	errorHandler: errorHandler
};

//dist 폴더를 기준으로 웹서버 실행
gulp.task('server', ['uglify', 'minifycss', 'minifyhtml'], function () {
    return browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

//pug 파일을 minify
gulp.task('minifyhtml', function () {
    return gulp.src('src/*.pug')
        .pipe(plumber(plumberOption))
        .pipe(pug({pretty: true}))
//        .pipe(minifyhtml())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream:true}));
});

//js 파일을 minify
gulp.task('uglify', function () {
	return gulp.src('src/**/*.js')
		.pipe(plumber(plumberOption))
		.pipe(concat('main.js'))
        .pipe(uglify())
		.pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream:true}));
});

//css 파일을 minify
gulp.task('minifycss', function () {
	return gulp.src('src/**/*.scss')
		.pipe(plumber(plumberOption))
		.pipe(sass())
		.pipe(autoprefixer())
        .pipe(concat('main.css'))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function () {
	gulp.watch('src/**/*.js', ['uglify']);
	gulp.watch('src/**/*.scss', ['minifycss']);
	gulp.watch('src/*.pug', ['minifyhtml']);
});

gulp.task('build', ['server','uglify', 'minifycss', 'minifyhtml']);

gulp.task('default', ['server', 'watch'] );
