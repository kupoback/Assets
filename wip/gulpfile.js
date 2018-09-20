/**
 * 1. Required Node Modules
 * 2. Path Variables
 *
 */


"use strict";

/*======================================
 1. Required Node Modules
 ======================================*/

const del          = require( "del" );
const browserSync  = require( "browser-sync" ).create();
const url          = require( "url" );
const userHome     = require( "user-home" );
const popper       = require( "popper.js" );
const bootstrap4   = require( "bootstrap" );
const runSequence  = require( "run-sequence" );
const gulp         = require( "gulp" );
const autoprefixer = require( "gulp-autoprefixer" );
const cleanCSS     = require( "gulp-clean-css" );
const concat       = require( "gulp-concat" );
const htmlreplace  = require( "gulp-html-replace" );
const rename       = require( "gulp-rename" );
const postcss      = require( "gulp-postcss" );
const sass         = require( "gulp-sass" );
const sourcemaps   = require( "gulp-sourcemaps" );
const uglify       = require( "gulp-uglify" );
const jpegCompress = require( "imagemin-jpeg-recompress" );
const merge        = require( "merge-stream" );
const dataTables   = require( "datatables.net-dt" );
const fancyBox     = require( "@fancyapps/fancybox" );
const owlCarousel  = require( "owl-carousel-2" );

/*======================================
 2. Path Variables
 ======================================*/

/**
 * We'll be setting up our node paths of plugins
 * we'll be using, plus our assets
 *
 * @type {string}
 * @private
 */
      // Node
const _npm_dir          = "./node_modules";
const _dev_dir          = "./dev/";
const _bs_src_js        = _npm_dir + "/bootstrap/src/js/dist";
const _bs_src_css       = _npm_dir + "/bootstrap/src/css/dist";
const _bs_dist_all_js   = _npm_dir + "/bootstrap/dist/js/bootstrap.bundle.min.*";
const _bs_dist_core_js  = _npm_dir + "/bootstrap/dist/js/bootstrap.min.*";
const _bs_dist_all_css  = _npm_dir + "/bootstrap/dist/css/*.min.*";
const _bs_dist_core_css = _npm_dir + "/bootstrap/dist/css/*.min.*";
const _popper           = _npm_dir + "/popper.js/dist/umd/popper.*";

// Alternate Plugins
const _dataTables_js  = _npm_dir + "/datatables.net-dt/js/dataTables.dataTables.min.js";
const _dataTables_css = _npm_dir + "/datatables.net-dt/css/jquery.dataTables.min.css";
const _dataTables_img = _npm_dir + "/datatables.net-dt/images/";
const _fancybox_js    = _npm_dir + "/@fancyapps/jquery.fancybox.min.js";
const _fancybox_css   = _npm_dir + "/@fancyapps/jquery.fancybox.min.css";

// Assets
const _assets_css = _dev_dir + "/sass";
const _assets_js  = _dev_dir + "/js";
const _assets_img = _dev_dir + "img";

/**
 * We'll be setting up our WordPress based options and paths
 * This includes our BrowserSyn settings
 *
 * @type {string}
 * @private
 */
const _theme_name        = "base";
const _themes_assets_dir = "../wp-content/themes/" + _theme_name + "/assets";
const _theme_css_dir     = _themes_assets_dir + "/css";
const _theme_js_dir      = _themes_assets_dir + "/js";
const _theme_img_dir     = _themes_assets_dir + "/img";

/*======================================
 3. Identify Plugins Used
 ======================================*/

/**
 * * In this variable, change it from true to false if you wish to
 * use every BootStrap javascript element, otherwise uncomment
 * the scripts you plan on using.
 *
 * If you plan on just using Bootstraps core ONLY, change _custom_bs to 'core'
 *
 * This helps on cutting down the file size of the application vendor script
 *
 * @type {string}
 * @private
 */
const _custom_bs   = "all";
let bs_js_compile  = "";
let bs_css_compile = "";

// Plugin Dirs
const _bs_alert    = _bs_src_js + "/alert.*";
const _bs_button   = _bs_src_js + "/button.*";
const _bs_collapse = _bs_src_js + "/collapse.*";
const _bs_dropdown = _bs_src_js + "/dropdown.*";
const _bs_modal    = _bs_src_js + "/modal.*";
const _bs_popover  = _bs_src_js + "/popover.*";
const _bs_tab      = _bs_src_js + "/tab.*";
const _bs_tooltip  = _bs_src_js + "/tooltip.*";
const _bs_util     = _bs_src_js + "/util.*";

if ( _custom_bs === "all" ) {
	bs_js_compile  = _bs_dist_all_js;
	bs_css_compile = _bs_dist_all_css;
} else if ( _custom_bs === "core" ) {
	bs_js_compile  = _bs_dist_core_js;
	bs_css_compile = _bs_dist_core_css;
} else {
	gulp.task( "build:bs:js", () => {

		// Define Bootstrap
		let bs4_scripts = [
			// Do not alter the order, just comment out what is not needed.

			// MUST BE ENABLED IF USING TOOLTIP OR POPOVERS AND MUST BE FIRST
			// If you are not using Tooltip or popover, this can be commented out.
			_popper,
			// MUST BE INCLUDED IF USING: Alerts, Dropdown, Popover, Tab, Tooltips
			_bs_util,
			// MUST BE INCLUDED FOR THE NAVIGATION UNLESS WE ARE BUILDING A CUSTOM ONE
			// Dropdown: http://getbootstrap.com/docs/4.1/components/dropdowns/
			_bs_dropdown,
			// Alert: http://getbootstrap.com/docs/4.1/components/alerts/#javascript-behavior
			_bs_alert,
			// Tab: http://getbootstrap.com/docs/4.1/components/navs/#javascript-behavior
			_bs_tab,
			// Tooltip: http://getbootstrap.com/docs/4.1/components/tooltips/
			_bs_tooltip,
			// ## END UTIL REQUIRE ##

			// Button: http://getbootstrap.com/docs/4.1/components/buttons/#methods
			_bs_button,
			// Accordion: http://getbootstrap.com/docs/4.1/components/collapse/
			_bs_collapse,
			// Modal: http://getbootstrap.com/docs/4.1/components/modal/
			_bs_modal,
			// Popover: http://getbootstrap.com/docs/4.1/components/popovers/
			_bs_popover,
		];

		// Define Specific Plugins we'll use
		let plugin_scripts = []

	} );
	gulp.task( "build:bs:css", () => {

	} )
}

/*======================================
 Clean Task
 ======================================*/

// Clean Task
// What we"re doing is cleaning our vendor and custom CSS files.
gulp.task( "clean", function() {
	return del( [
		"dist", gulp.series( [
			"/dev/sass/application-vendor.scss",
			"/dev/sass/application.scss"
		] )
	] );
} );

// Copy third party libraries from node_modules into /vendor
gulp.task( "vendor:js", function() {
	return gulp.src( [] )
} );