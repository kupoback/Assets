/**
 * Author: Nick Makris
 * Author URI: makris.io
 *
 * 1. Project Setup
 * 2. Required Node Modules
 * 3. Path Variables - DO NOT TOUCH
 * 4. Array Variables for Gulp
 * 5. Build/Compile JS
 * 6. Build/Compile CSS
 *
 */

"use strict";

/*======================================
 1. Project Setup
 ======================================*/

//region Theme URL Settings
const _THEME_NAME = "base"; // Theme Name - Generally the project name
const _THEME_URL  = "https://grunt-rework.app"; // The URL to work locally. Make sure to secure the URL
const _SSL_KEY    = "/Users/nmak/.config/valet/Certificates/grunt-rework.app.key"; // Update username and URL
const _SSL_CERT   = "/Users/nmak/.config/valet/Certificates/grunt-rework.app.crt"; // Update username and URL
//endregion

//region Theme Variables - DO NOT TOUCH
const addPaths           = ( ...paths ) => paths.reduce( ( p, c ) => p.concat( c ), [] );
const _THEMES_ASSETS_DIR = "../wp-content/themes/" + _THEME_NAME + "/assets";
const _THEME_CSS_DIR     = _THEMES_ASSETS_DIR + "/css/";
const _THEME_JS_DIR      = _THEMES_ASSETS_DIR + "/js/";
const _THEME_IMG_DIR     = _THEMES_ASSETS_DIR + "/img/";
//endregion

/*======================================
 2. Required Node Modules
 ======================================*/

//region Node Modules
const gulp        = require( "gulp" );
const glob        = require( "glob" );
const del         = require( "del" ); // rm -rf
const sass        = require( "gulp-sass" );
const browserSync = require( "browser-sync" ).create();

// Added Modules
const autoprefixer = require( "autoprefixer" );
const concat       = require( "gulp-concat" );
const cssnano      = require( "cssnano" );
const globbing     = require( "gulp-css-globbing" );
const flatten      = require( "gulp-flatten" );
const newer        = require( "gulp-newer" );
const rename       = require( "gulp-rename" );
const plumber      = require( "gulp-plumber" );
const postcss      = require( "gulp-postcss" );
const sourcemaps   = require( "gulp-sourcemaps" );
const terser       = require( "gulp-terser" );
//endregion

/*======================================
 3. Path Variables
 ======================================*/

//region Folder Locations - DO NOT TOUCH
const _DEV_DIR = "./dev";
const _NPM_DIR = "./node_modules";
//endregion

//region Development Assets - DO NOT TOUCH
const _ASSETS_CSS    = _DEV_DIR + "/sass";
const _ASSETS_JS     = _DEV_DIR + "/js";
const _ASSETS_IMG    = _DEV_DIR + "/img";
const _BS_SRC        = _NPM_DIR + "/bootstrap";
const _BS_JS         = _BS_SRC + "/dist/js";
const _BS_CSS        = _BS_SRC + "/scss/";
const _BS_CSS_ASSETS = _ASSETS_CSS + "/core/bs";
//endregion

//region DO NOT TOUCH
//region Bootstrap
// Bootstrap 4 Files. Pick either all or core.
// DO NOT ALTER ANY OF THE OBJECT ORDERS
const _bs_files = {
	scripts: _BS_JS + "/bootstrap.bundle.js",
	sass   : {
		mixins    : _BS_CSS + "mixins",
		utilities : _BS_CSS + "utilities",
		required  : [
			// Do not uncomment
			_BS_CSS + "_functions.scss",
			_BS_CSS + "_variables.scss",
			_BS_CSS + "_mixins.scss",
			_BS_CSS + "_reboot.scss",
			_BS_CSS + "_grid.scss",
			_BS_CSS + "_transitions.scss",
			_BS_CSS + "_media.scss",
			_BS_CSS + "_root.scss",
			_BS_CSS + "_images.scss",
			_BS_CSS + "_utilities.scss",
			_BS_CSS + "_print.scss",
			_BS_CSS + "_close.scss",
			_BS_CSS + "_type.scss",
			_BS_CSS + "_dropdown.scss",
			_BS_CSS + "_nav.scss",
			_BS_CSS + "_navbar.scss",
		],
		additional: [
			// Uncomment what you need
			// Common files
			// _BS_CSS + '_buttons.scss',
			// _BS_CSS + '_button-group.scss',
			// _BS_CSS + '_card.scss',
			// _BS_CSS + '_tables.scss',
			// _BS_CSS + '_list-group.scss',
			// _BS_CSS + '_modal.scss',
			// Dependent on each other
			// _BS_CSS + '_forms.scss',
			// _BS_CSS + '_custom-forms.scss',
			// _BS_CSS + '_input-group.scss',
			// End dependency

			// Dependent on each other
			// _BS_CSS + '_popover.scss',
			// _BS_CSS + '_tooltip.scss',
			// End dependency

			//Uncommon files
			// _BS_CSS + '_code.scss',
			// _BS_CSS + '_alert.scss',
			// _BS_CSS + '_badge.scss',
			// _BS_CSS + '_breadcrumb.scss',
			// _BS_CSS + '_carousel.scss',
			// _BS_CSS + '_jumbotron.scss',
			// _BS_CSS + '_pagination.scss',
			// _BS_CSS + '_progress.scss',
		]
	}
};
//endregion
//endregion

//region Alternate Javascript or CSS Plugins
// Add to this array and include within
// the _vendor_scripts and _vendor_styles in their section
// For every plugin include a name!
const additionalPlugins = {
	// Data Tables
	_dataTables  : {
		name   : "datatables",
		scripts: {
			core: _NPM_DIR + "/datatables.net/js/jquery.dataTables.js",
			bs  : _NPM_DIR + "/datatables.net-bs4/js/dataTables.bootstrap4.js"
		},
		styles : {
			bs: _NPM_DIR + "/datatables.net-bs4/css/dataTables.bootstrap4.css"
		}
	},
	// Fancy Box
	_fancyBox    : {
		name   : "fancybox",
		scripts: _NPM_DIR + "/@fancyapps/fancybox/dist/jquery.fancybox.js",
		styles : _NPM_DIR + "/@fancyapps/fancybox/dist/jquery.fancybox.css",
	},
	_mixitup : {
		scripts: _NPM_DIR + "/mixitup/dist/mixitup.js"
	},
	// Modaal
	_modaal      : {
		name   : "modaal",
		scripts: _NPM_DIR + "/modaal/dist/js/modaal.js",
		styles : _NPM_DIR + "/modaal/dist/css/modaal.scss",
	},
	// Owl-Carousel 2
	_owlCarousel : {
		name   : "owlcarousel",
		scripts: _NPM_DIR + "/owl-carousel-2/owl.carousel.js",
		styles : [
			_NPM_DIR + "/owl-carousel-2/assets/owl.carousel.css",
			// Alternative
			_NPM_DIR + "/owl-carousel-2/assets/owl.theme.default.css",
		],
		media  : _NPM_DIR + "/owl-carousel-2/assets/ajax-loader.gif",
	},
	//Paroller
	_paroller    : {
		name   : "paroller",
		scripts: _NPM_DIR + "/paroller.js/dist/jquery.paroller.js",
	},
	//Scroll Reveal
	_scrollReveal: {
		name   : "scrollreveal",
		scripts: _NPM_DIR + "/scrollreveal/dist/scrollreveal.es.js",
	},
};
//endregion

//region Custom Theme Assets
const _dev_files = {
	scripts: {
		core  : _ASSETS_JS + "/core/**/*.js",
		custom: _ASSETS_JS + "/scripts/**/*.js"
	},
	styles : {
		core  : _ASSETS_CSS + "/application-vendor.scss",
		custom: _ASSETS_CSS + "/application.scss"
	}
};
//endregion

//region Our Bootstrap Scripts
let _vendor_scripts = [
	_bs_files.scripts,
	_dev_files.scripts.core
];
//endregion

//region Our Bootstrap Styles
let _bs_styles = addPaths(
	_bs_files.sass.required,
	_bs_files.sass.additional
);
//endregion

//region Plugin Scripts - Uncomment or Add what you need
let _pluginScripts = addPaths(
	// additionalPlugins._dataTables.scripts.core,
	// additionalPlugins._dataTables.scripts.bs,
	// additionalPlugins._fancyBox.scripts,
	// additionalPlugins._mixitup.scripts,
	// additionalPlugins._modaal.scripts,
	// additionalPlugins._owlCarousel.scripts,
	// additionalPlugins._paroller.scripts,
	// additionalPlugins._scrollReveal.scripts,
);
//endregion

//region Plugin Styles - Uncomment or add what you need
let _pluginStyles = addPaths(
	// additionalPlugins._dataTables.styles.bs,
	// additionalPlugins._fancyBox.styles,
	// additionalPlugins._modaal.styles,
	// additionalPlugins._owlCarousel.styles,
);
//endregion

//region Fonts - IN PROGRESS
const fonts = {
	fa5: {
		styles: _NPM_DIR + "/@fontawesome/fontawesome-pro/css/all.min.css"
	}
};
//endregion

/*======================================
 4. Functions
 ======================================*/

// gulp.task('clean', function(done) {
// 	del(['./dev'], done);
// });

function clean( dir ) {
	return function( done ) {
		del( `${dir}`, done );
	}
}

//region SASS Functions
//region Function to copy files recursively
function moveDirTask( dir, dest, dirName = "" ) {
	return function() {
		return gulp
			.src( `${dir}/**/*` )
			.pipe( plumber( {
				errorHandler: errorAlert
			} ) )
			.pipe( gulp.dest( `${dest}/${dirName}/` ) );
	};
}

//endregion

//region Compile sass files
function sassCompile( file ) {
	const plugin_opts = [
		autoprefixer( {
			browsers: [ "cover 99.5%" ]
		} ),
		cssnano()
	];

	return function() {
		return gulp
			.src( [ `${file}` ] )
			.pipe( plumber( {
				errorHandler: errorAlert
			} ) )
			.pipe( flatten() )
			.pipe( sourcemaps.init() )
			.pipe( globbing( {
				extensions: ".scss"
			} ) )
			.pipe( sass().on( "error", sass.logError ) )
			.pipe( postcss( plugin_opts ) )
			.pipe( rename( {
				suffix: ".min"
			} ) )
			.pipe( sourcemaps.write( "./" ) )
			.pipe( gulp.dest( _THEME_CSS_DIR ) )
			.pipe( browserSync.stream() );
	}
}

//endregion
//endregion

//region Error Functions
// Error reporting function
function handleError( err ) {
	console.log( err.toString() );
	this.emit( "end" );
}

const onError = function( err ) {
	console.log( err );
};

function errorAlert( error ) {
	notify.onError( {
		title  : "SCSS Error",
		message: "😭  Assets Compiler | Check your terminal to see what's wrong in your sass files 😭"
	} )( error );
	console.log( error.toString() );
	this.emit( "end" );
};
//endregion

/*======================================
 5. Build/Compile JS
 ======================================*/

//region Build Vendor Scripts
gulp.task( "build:vendor:scripts", () => {

	if ( _pluginScripts.length > 0 ) {
		_vendor_scripts = _pluginScripts.concat( _vendor_scripts );
	}

	return gulp
		.src( addPaths( _vendor_scripts ) )
		.pipe( plumber( {
			errorHandler: onError
		} ) )
		.pipe( sourcemaps.init() )
		.pipe( terser() )
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
		.src( _dev_files.scripts.custom )
		.pipe( plumber( {
			errorHandler: handleError
		} ) )
		.pipe( sourcemaps.init() )
		.pipe( terser() )
		.pipe( concat( "application.min.js" ) )
		.pipe( sourcemaps.write( "." ) )
		.on( "error", handleError )
		.pipe( gulp.dest( _THEME_JS_DIR ) )
		;

} );
//endregion

/*======================================
 6. Build/Compile CSS
 ======================================*/

//region Import SASS
//region Copy BootStrap SASS Files - DO NOT TOUCH
gulp.task( "grab:bs:mixins", moveDirTask( _bs_files.sass.mixins, _BS_CSS_ASSETS, "mixins" ) );
gulp.task( "grab:bs:util", moveDirTask( _bs_files.sass.utilities, _BS_CSS_ASSETS, "utilities" ) );
gulp.task( "grab:bs:sass", () => {
	return gulp
		.src( addPaths( _bs_styles ) )
		.pipe( plumber( {
			errorHandler: errorAlert
		} ) )
		.pipe( gulp.dest( _BS_CSS_ASSETS ) );
} );
//endregion

//region Copy Vendor Styles
gulp.task( "copy:plugin:styles", function() {
	if ( _pluginStyles.length > 0 ) {
		return gulp
			.src( _pluginStyles )
			.pipe( plumber( {
				errorHandler: errorAlert
			} ) )
			.pipe( rename( {
				extname: ".scss"
			} ) )
			.pipe( gulp.dest( _ASSETS_CSS + "/core/vendor" ) );
	} else {
		return console.log( "No Plugin Styles Declared" );
	}
} );
//endregion

const import_styles = gulp.series( "grab:bs:mixins", "grab:bs:util", "grab:bs:sass", "copy:plugin:styles" );
gulp.task( "import_styles", import_styles );
//endregion

//region Build CSS
gulp.task( "build:vendor:styles", sassCompile( _ASSETS_CSS + "/application-vendor.scss" ) );
gulp.task( "build:site:styles", sassCompile( _ASSETS_CSS + "/application.scss" ) );
//endregion

/*======================================
 7. PHP Concatenation
 ======================================*/

/*======================================
 8. Serve/Watch
 ======================================*/

/*======================================
 Test Function
 ======================================*/
gulp.task( "hello", function() {
	console.log();
} );

/*======================================
 Functions
 ======================================*/



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
