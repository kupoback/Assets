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
gulp.task('vendor:js', function() {
	return gulp.src([

		/* IF YOU WANT TO INCLUDE ALL THE BOOTSTRAP JAVASCRIPT ITEMS
		 AS YOU FEEL YOU'LL BE USING THEM ALL, UNCOMMENT THIS
		 AND COMMENT OUT THE REMAINDER OF FILE PATHS
	  */

		// ## START ALL BOOTSTRAP JAVASCRIPT ##
		// './node_modules/bootstrap/dist/js/bootstrap.bundle.*',
		// ## END ALL BOOTSTRAP JAVASCRIPT

		/*
		## START BOOTSTRAP INDIVIDUAL JAVASCRIPT ITEMS ##
		For ANY Bootstrap 4 javascript file, we need Popper first
		 */
		'./node_modules/popper.js/dist/umd/popper.min.*',

		// Next we need Bootstraps util.js and index.js file
		'./node_modules/bootstrap/src/js/index.*',
		'./node_modules/bootstrap/src/js/util.*',

		// Here we'll define which Bootstrap Javascript Elements we need for the project.
		// Comment out any files you will not need

		// ALERT
		'./node_modules/bootstrap/src/js/alert.*',
		// BUTTON
		'./node_modules/bootstrap/src/js/button.*',
		// CAROUSEL
		'./node_modules/bootstrap/src/js/carousel.*',
		// COLLAPSE
		'./node_modules/bootstrap/src/js/collapse.*',
		// DROPDOWN
		'./node_modules/bootstrap/src/js/dropdown.*',
		// MODAL
		'./node_modules/bootstrap/src/js/modal.*',
		// TOOLTIP
		'./node_modules/bootstrap/src/js/tooltip.*',
		// POPOVER
		'./node_modules/bootstrap/src/js/popover.*',
		// SCROLL SPY
		'./node_modules/bootstrap/src/js/scrollspy.*',
		// TAB
		'./node_modules/bootstrap/src/js/tab.*',

		// ## END BOOTSTRAP ##

		// ## START OTHER PLUGINS ##

		/**
		 * Plugin Name: DataTables
		 * Author URI : https://datatables.net
		 */





	])
});