/**
 * Author: Nick Makris
 * Author URI: makris.io
 *
 * 1. Required Node Modules
 * 2. Path Variables - DO NOT TOUCH
 * 3. Array Variables for Gulp
 *
 */

"use strict";

/*======================================
 1. Required Node Modules
 ======================================*/

// DEVELOPER ATTENTION
// SET THIS NEXT VARIABLE TO BE EITHER TRUE OR FALSE
// TO DETERMINE WHICH COMPILATION OF BOOTSTRAP WE'RE
// GOING TO USE ON THIS SITE
const bs4_full = false;

//region Required Plugins
const $            = require("jquery");
const autoprefixer = require( "gulp-autoprefixer" );
const browserSync  = require( "browser-sync" ).create();
const cleanCSS     = require( "gulp-clean-css" );
const concat       = require( "gulp-concat" );
const del          = require( "del" );
const dt           = require( "datatables.net" );
const dtBS4        = require( "datatables.net-bs4");
const glob         = require( "glob" );
const gulp         = require( "gulp" );
const htmlreplace  = require( "gulp-html-replace" );
const jpegCompress = require( "imagemin-jpeg-recompress" );
const merge        = require( "merge-stream" );
const runSequence  = require( "run-sequence" );
const rename       = require( "gulp-rename" );
const postcss      = require( "gulp-postcss" );
const sass         = require( "gulp-sass" );
const sourcemaps   = require( "gulp-sourcemaps" );
const uglify       = require('gulp-uglify-es').default;
const url          = require( "url" );
const userHome     = require( "user-home" );
//endregion

/*======================================
 2. Path Variables
 ======================================*/

//region DO NOT TOUCH
// Folder Locations
const _dev_dir = "./dev";
const _npm_dir = "./node_modules";
//endregion

//region DO NOT TOUCH
// Development Assets
const _assets_css = _dev_dir + "/sass";
const _assets_js  = _dev_dir + "/js";
const _assets_img = _dev_dir + "/img";
const _bs_src_js  = _npm_dir + "/bootstrap/js/dist";
//endregion

//region Theme Variables
const addPaths           = ( ...paths ) => paths.reduce( ( p, c ) => p.concat( c ), [] );
const _theme_name        = "base";
const _themes_assets_dir = "../wp-content/themes/" + _theme_name + "/assets";
const _theme_css_dir     = _themes_assets_dir + "/css/";
const _theme_js_dir      = _themes_assets_dir + "/js/";
const _theme_img_dir     = _themes_assets_dir + "/img/";
//endregion

/*======================================
 3. Array Variables for Gulp
 ======================================*/

//region Bootstrap
// Bootstrap 4 Files. Pick either all or core.
// DO NOT ALTER ANY OF THE OBJECT ORDERS
const _bs_files = {
	// Bootstraps Full Build
	all:  {
		scripts: _npm_dir + "/bootstrap/dist/js/bootstrap.bundle.min.js",
		styles:  _npm_dir + "/bootstrap/dist/css/*.min.css"
	},
	// Custom Core
	core: {
		// Bootstraps Styles
		styles:    [
			// Base Styles
			_npm_dir + "/bootstrap/dist/css/*.min.js",
		],
		// Bootstraps Scripts
		scripts:   [
			// Popper
			_npm_dir + "/popper.js/dist/umd/popper.min.js",
			// Base
			_npm_dir + "/bootstrap/dist/js/bootstrap.min.js",
			// Util
			_bs_src_js + "/util.js"
		],
		// This is required, do not comment out.
		reqPopper: [
			// Dropdown
			_bs_src_js + "/dropdown.js"
		],
		// All of Boootstrap 4's Plugins we use. Comment out the ones you don't plan to use from here.
		plugins:   [
			// Alert
			_bs_src_js + "/alert.js",
			// Button
			_bs_src_js + "/button.js",
			// Collapse/Accordion
			_bs_src_js + "/collapse.js",
			// Modal
			_bs_src_js + "/modal.js",
			// Tooltip
			_bs_src_js + "/tooltip.js",
			// Popover
			// NOTE: THIS REQUIRES TOOLTIP.JS!
			_bs_src_js + "/popover.js",
			// Tab
			_bs_src_js + "/tab.js",
		],
	},
};
//endregion

//region Alternate Javascript or CSS Plugins
const additionalPlugins = {
	scripts: [
		// Data Tables
		_npm_dir + "/datatables.net/js/jquery.dataTables.min.js",
		// _npm_dir + "/datatables.net-dt/js/dataTables.dataTables.min.js",
		// Fancy Box
		_npm_dir + "/@fancyapps/fancybox/dist/jquery.fancybox.min.js",
		// Owl-Carousel-2
		_npm_dir + "/owl-carousel-2/owl.carousel.min.js",
		// Paroller
		_npm_dir + "/paroller.js/dist/jquery.paroller.min.js",
		// Scroll Reveal
		_npm_dir + "/scrollreveal/dist/scrollreveal.min.js",
	],
	styles:  [
		// Data Tables
		_npm_dir + "/datatables.net-dt/css/jquery.dataTables.min.css",
		// Fancybox
		_npm_dir + "/@fancyapps/fancybox/dist/jquery.fancybox.min.css",
		// Owl-Carousel-2
		_npm_dir + "/owl-carousel-2/assets/owl.carousel.min.css",
		// Owl-Carousel-2 Default
		_npm_dir + "/owl-carousel-2/assets/owl.theme.default.min.css",
	],
	media:   [
		// Data Tables
		_npm_dir + "/datatables.net-dt/images/",
		// Owl-Carousel-2 Ajax Loader
		_npm_dir + "/owl-carousel-2/assets/ajax-loader.gif"
	]
};
//endregion

//region Custom Theme Assets
const _dev_files = {
	scripts: {
		core:   _assets_js + "/core/**/*.js",
		custom: _assets_js + "/scripts/**/*.js"
	}
};
//endregion

//region Fonts
const fonts = {
	fa5: {
		styles: _npm_dir + "/@fontawesome/fontawesome-pro/css/all.min.css"

	}
};
//endregion

/*======================================
 3. Identify Plugins Used
 ======================================*/

let _bs_js_compile = _bs_files.all.scripts;

if ( bs4_full !== true ) {
	_bs_js_compile = addPaths(
		_bs_files.core.scripts,
		_bs_files.core.reqPopper,
		_bs_files.core.plugins
	);
}

gulp.task( "build:vendor:scripts", () => {
	const buildVendorScripts =  gulp
		.src( addPaths( _bs_js_compile, additionalPlugins.scripts, _dev_files.scripts.core ) )
		.pipe( sourcemaps.init() )
		.pipe( concat( "application-vendor.js" ) )
		.pipe( uglify() )
		.pipe( sourcemaps.write('.') )
		.on( "error", handleError )
		.pipe( gulp.dest( _theme_js_dir ) )
		;

	return buildVendorScripts;

} );

gulp.task( "build:site:scripts", () => {
	const buildSiteScripts = gulp
		.src( addPaths( _dev_files.scripts.custom ) )
		.pipe( sourcemaps.init() )
		.pipe( concat( "application.js" ) )
		.pipe( uglify() )
		.pipe( sourcemaps.write('.') )
		.on( "error", handleError )
		.pipe( gulp.dest( _theme_js_dir ) )
		;

	return buildSiteScripts;
} );

/*======================================
 Test Function
 ======================================*/
gulp.task( "hello", function() {
	console.log();
} );

/*======================================
 Functions
 ======================================*/

// Error reporting function
function handleError( err ) {
	console.log( err.toString() );
	this.emit( "end" );
}

/*======================================
 Final Commands
 ======================================*/

gulp.task(
	"default",
	gulp.parallel( [
		"build:vendor:scripts",
		"build:site:scripts"
	] )
);

//region File Notes
// Note that the above is the same as this, except that if one of them is a string it will be expanded
// The ... is an operator that will handle a scalar
// to an array of characters, which is not what you want, so don't do this, use addPaths:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
// _bs_compile = [
// 	..._bs_files.core.script,
// 	..._bs_files.core.reqPopper,
// 	..._bs_files.core.plugins
// ];
//endregion