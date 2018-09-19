"use strict";

const gulp = require('gulp'),
	sass = require('gulp-sass'),
	del = require('del'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	merge = require('merge-stream'),
	htmlreplace = require('gulp-html-replace'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create();


// Clean Task
// What we're doing is cleaning our vendor and custom CSS files.
gulp.task('clean', function() {
	return del(['dist', gulp.series( [
		'/dev/sass/application-vendor.scss',
		'/dev/sass/application.scss'] )
	]);
});

// Copy third party libraries from node_modules into /vendor