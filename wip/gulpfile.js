/**
 * Author: Nick Makris
 * Author URI: makris.io
 *
 * 1. Required Node Modules
 * 2. Path Variables - DO NOT TOUCH
 * 3. Array Variables for Gulp
 * 4. Build/Compile JS
 * 5. Build/Compile CSS
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
const $ = require( "gulp-load-plugins" );
const autoprefixer = require( "autoprefixer" );
const babel = require( "gulp-babel" );
const browserSync = require( "browser-sync" ).create();
const browserSyncReload = require( "browser-sync" ).reload();
const browserSyncStream = require("browser-sync").stream();
const concat = require( "gulp-concat" );
const cssnano = require("cssnano");
const del = require( "del" );
const flatten = require( "gulp-flatten" );
const glob = require( "glob" );
const gulp = require( "gulp" );
const jpegCompress = require( "imagemin-jpeg-recompress" );
const merge = require( "merge-stream" );
const runSequence = require( "run-sequence" );
const rename = require( "gulp-rename" );
const plumber = require( "gulp-plumber" );
const postcss = require( "gulp-postcss" );
const sass = require( "gulp-sass" );
const sourcemaps = require( "gulp-sourcemaps" );
const uglify = require( "gulp-uglify-es" ).default;
const url = require( "url" );
const userHome = require( "user-home" );
//endregion

/*======================================
 2. Path Variables
 ======================================*/

//region Folder Locations - DO NOT TOUCH
const _DEV_DIR = "./dev";
const _NPM_DIR = "./node_modules";
//endregion

//region Development Assets - DO NOT TOUCH
const _ASSETS_CSS = _DEV_DIR + "/sass";
const _ASSETS_JS = _DEV_DIR + "/js";
const _ASSETS_IMG = _DEV_DIR + "/img";
const _BS_SRC = _NPM_DIR + "/bootstrap";
const _BS_SRC_JS = _BS_SRC + "/js/dist";
const _BS_SRC_CSS = _BS_SRC + "/css/dist";
//endregion

//region Theme Variables - DO NOT TOUCH
const addPaths = (...paths) => paths.reduce( (p, c) => p.concat( c ), [] );
const _THEME_NAME = "base";
const _THEMES_ASSETS_DIR = "../wp-content/themes/" + _THEME_NAME + "/assets";
const _THEME_CSS_DIR = _THEMES_ASSETS_DIR + "/css/";
const _THEME_JS_DIR = _THEMES_ASSETS_DIR + "/js/";
const _THEME_IMG_DIR = _THEMES_ASSETS_DIR + "/img/";
//endregion

/*======================================
 3. Array Variables for Gulp
 ======================================*/

//region DO NOT TOUCH

//region Bootstrap
// Bootstrap 4 Files. Pick either all or core.
// DO NOT ALTER ANY OF THE OBJECT ORDERS
// @TODO: Try and concatenate BS JS files with CSS files
const _bs_files = {
	all:  {
		// Bootstraps Full Build
		scripts: _BS_SRC + "/dist/js/bootstrap.bundle.js",
		styles:  _BS_SRC + "/dist/css/bootstrap.min.css"
	},
	// Custom Core
	// DO NOT USE FOR NOW
	core: {
		// Bootstraps Scripts
		/*
		 scripts: {
		 // This is required, do not comment out.
		 required: [
		 // _NPM_DIR + "/popper.js/dist/umd/popper.js",
		 // Util
		 _BS_SRC_JS + "/util.js",
		 // Dropdown
		 _BS_SRC_JS + "/dropdown.js"
		 ],
		 // All of Boootstrap 4's Plugins we use. Comment out the ones you don't plan to use from here.
		 plugins:  [
		 // Alert
		 // _BS_SRC + "/js/dist/alert.js",
		 // Button
		 // _BS_SRC + "/js/dist/button.js",
		 // Collapse/Accordion
		 // _BS_SRC + "/js/dist/collapse.js",
		 // Modal
		 // _BS_SRC + "/js/dist/modal.js",
		 // Tooltip
		 // _BS_SRC + "/js/dist/tooltip.js",
		 
		 // Popover
		 // NOTE: THIS REQUIRES TOOLTIP.JS!
		 // _BS_SRC + "/js/dist/popover.js",
		 // Tab
		 // _BS_SRC + "/js/dist/tab.js",
		 ],
		 end : [
		 // Index
		 _BS_SRC_JS + "/index.js",
		 ]
		 } */
	},
};
//endregion

//region Alternate Javascript or CSS Plugins
const additionalPlugins = {
	// Data Tables
	dataTables:   {
		scripts: {
			core: _NPM_DIR + "/datatables.net/js/jquery.dataTables.js",
			bs:   _NPM_DIR + "/datatables.net-bs4/js/dataTables.bootstrap4.js"
		},
		styles:  {
			bs: _NPM_DIR + "/datatables.net-bs4/css/dataTables.bootstrap4.min.js"
		}
	},
	// Fancy Box
	fancyBox:     {
		scripts: _NPM_DIR + "/@fancyapps/fancybox/dist/jquery.fancybox.min.js",
		styles:  _NPM_DIR + "/@fancyapps/fancybox/dist/jquery.fancybox.min.css",
	},
	// Owl-Carousel 2
	owlCarousel:  {
		scripts: _NPM_DIR + "/owl-carousel-2/owl.carousel.min.js",
		styles:  [
			_NPM_DIR + "/owl-carousel-2/assets/owl.carousel.min.css",
			// Alternative
			_NPM_DIR + "/owl-carousel-2/assets/owl.theme.default.min.css",
		],
		media:   _NPM_DIR + "/owl-carousel-2/assets/ajax-loader.gif",
	},
	//Paroller
	paroller:     {
		scripts: _NPM_DIR + "/paroller.js/dist/jquery.paroller.min.js",
	},
	//Scroll Reveal
	scrollReveal: {
		scripts: _NPM_DIR + "/scrollreveal/dist/scrollreveal.min.js",
	},
};
//endregion

//region Custom Theme Assets
const _dev_files = {
	scripts: {
		core:   _ASSETS_JS + "/core/**/*.js",
		custom: _ASSETS_JS + "/scripts/**/*.js"
	},
	styles:  {
		core:   _ASSETS_CSS + "/application-vendor.scss",
		custom: _ASSETS_CSS + "/application.scss"
	}
};
//endregion

//region Fonts
const fonts = {
	fa5: {
		styles: _NPM_DIR + "/@fontawesome/fontawesome-pro/css/all.min.css"
		
	}
};
//endregion

let _bs_js_compile = _bs_files.all.scripts;
let _bs_css_compile = _bs_files.all.styles;
let _dev_core_scripts = _dev_files.scripts.core;
let _dev_custom_scripts = _dev_files.scripts.custom;
let _dev_core_styles = _dev_files.styles.core;
let _dev_custom_styles = _dev_files.styles.custom;
//endregion

/*======================================
 4. Build/Compile JS
 ======================================*/

//region Plugin Scripts - Uncomment what you need
let additionalPluginScripts = addPaths(
	// additionalPlugins.dataTables.scripts.core,
	// additionalPlugins.dataTables.scripts.bs,
	// additionalPlugins.fancyBox.scripts,
	// additionalPlugins.owlCarousel.scripts,
	// additionalPlugins.paroller.scripts,
	// additionalPlugins.scrollReveal.scripts,
);
//endregion

//region Build Vendor Scripts
gulp.task( "build:vendor:scripts", () => {
	return gulp
		.src( addPaths( _bs_js_compile, additionalPluginScripts, _dev_core_scripts ) )
		.pipe( plumber( {
			errorHandler: onError
		} ) )
		.pipe( sourcemaps.init() )
		.pipe( uglify() )
		.pipe( concat( "application-vendor.min.js" ) )
		.pipe( sourcemaps.write( "." ) )
		.on( "error", handleError )
		.pipe( gulp.dest( _THEME_JS_DIR ) )
		;
	
} );
//endregion

//region Build Site Scripts
gulp.task( "build:site:scripts", () => {
	return gulp
		.src( _dev_custom_scripts )
		.pipe( plumber( {
			errorHandler: onError
		} ) )
		.pipe( sourcemaps.init() )
		.pipe( uglify() )
		.pipe( concat( "application.min.js" ) )
		.pipe( sourcemaps.write( "." ) )
		.on( "error", handleError )
		.pipe( gulp.dest( _THEME_JS_DIR ) )
		;
	
} );
//endregion

/*======================================
 5. Build/Compile CSS
 ======================================*/

let additionalPluginStyles = addPaths(
	// additionalPlugins.dataTables.styles.bs,
	// additionalPlugins.fancyBox.styles,
	// additionalPlugins.owlCarousel.styles,
);

//region Build Vendor CSS
gulp.task( "build:vendor:css", () => {
	return gulp
		.src( addPaths( _dev_core_styles ) )
		.pipe( flatten() )
		.pipe( sourcemaps.init() )
		.pipe( sass().on( "error", sass.logError ) )
		.pipe( postcss( [
			autoprefixer(),
			cssnano()
		] ) )
		.pipe( sourcemaps.write() )
		.on( "error", handleError )
		.pipe( gulp.dest( _THEME_CSS_DIR ) )
		.pipe(browserSyncStream)
		;
	
	
} );
//endregion

//region Build Site CSS

//endregion

/*======================================
 Test Function
 ======================================*/
gulp.task( "hello", function () {
	console.log();
} );

/*======================================
 Functions
 ======================================*/

// Error reporting function
function handleError (err) {
	console.log( err.toString() );
	this.emit( "end" );
}

const onError = function (err) {
	console.log( err );
};

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