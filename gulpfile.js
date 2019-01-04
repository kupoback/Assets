var url                   = "https://base.app/", // Your testing URL
    proj_dir              = "../wp-content/themes/base_theme", // Give a project path
    // EXAMPLE
    // ssl_key = '/Users/username/.config/valet/Certificates/domain.TLS.key',
    ssl_key               = "/Users/nmak/.config/valet/Certificates/base.app.key", // Replace with path for your SSL key
    ssl_cert              = "/Users/nmak/.config/valet/Certificates/base.app.crt", // Replace with path for your SSL key
    gulp                  = require( "gulp" ),
    autoprefixer          = require( "autoprefixer" ),
    concat                = require( "gulp-concat" ),
    cssnano               = require( "cssnano" ),
    exists                = require( "file-exists" ),
    flatten               = require( "gulp-flatten" ),
    globbing              = require( "gulp-css-globbing" ),
    newer                 = require( "gulp-newer" ),
    postcss               = require( "gulp-postcss" ),
    rename                = require( "gulp-rename" ),
    sass                  = require( "gulp-sass" ),
    sequence              = require( "gulp-sequence" ),
    sourcemaps            = require( "gulp-sourcemaps" ),
    strip                 = require( "gulp-strip-comments" ),
    uglify                = require( "gulp-uglify" ),
    browserSync           = require( "browser-sync" ).create(),
    reload                = browserSync.reload,
    _PROJ_CSS             = proj_dir + "/assets/css",
    _PROJ_JS              = proj_dir + "/assets/js",
    _PROJ_IMG             = proj_dir + "/assets/img",
    _PROJ_PHP             = proj_dir + "/inc/compiled",
    _NPM_DIR              = "./node_modules",
    _BS_DIR               = _NPM_DIR + "/bootstrap",
    _BS_CSS               = _BS_DIR + "/scss/",
    addPaths              = (...paths) => paths.reduce( (p, c) => p.concat( c ), [] ),
    _BS_CSS_MUST_IMPORT   = [
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
    _BS_ADDITIONAL_IMPORT = [

	    // Uncomment what you need
	    // Common files
	    // _BS_CSS + "_buttons.scss",
	    // _BS_CSS + '_button-group.scss',
	    // _BS_CSS + '_card.scss',
	    // _BS_CSS + '_tables.scss',
	    // _BS_CSS + '_list-group.scss',
	    // _BS_CSS + "_modal.scss",
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
    ],
    _BS_JS                = _BS_DIR + "/dist/js/bootstrap.bundle.min.js",
    _PLUGINS              = {
	    // Interactive table
	    _dataTables:    {
		    scripts: {
			    required: _NPM_DIR + "/datatables.net/js/jquery.dataTables.js",
			    bs4:      _NPM_DIR + "/datatables.net-bs4/js/dataTables.bootstrap4.js"
		    },
		    styles:  _NPM_DIR + "/datatables.net-bs4/css/dataTables.bootstrap4.css"
	    },
	    // Lightbox Plugingulp
	    _fancybox:      {
		    scripts: _NPM_DIR + "/@fancyapps/fancybox/dist/jquery.fancybox.js"
	    },
	    // Filter Plugin
	    _mixitup:       {
		    scripts: _NPM_DIR + "/mixitup/dist/mixitup.js"
	    },
	    // Slider
	    _owlCarousel:   {
		    scripts: _NPM_DIR + "/owl-carousel-2/owl.carousel.js",
		    styles:  {
			    required:   _NPM_DIR + "/owl-carousel-2/assets/owl.carousel.css",
			    additional: _NPM_DIR + "/owl-carousel-2/assets/owl.theme.default.css",
		    },
		    media:   _NPM_DIR + "/owl-carousel-2/assets/*.{jpg,png,gif}",
	    },
	    // Similar to lazyload but for elements
	    _scrollReveal:  {
		    scripts: _NPM_DIR + "/scrollreveal/dist/scrollreveal.js"
	    },
	    // Accessibility for "Skip to content" links
	    _skipLinkFocus: {
		    scripts: _NPM_DIR + "/skip-link-focus/skip-link-focus.js"
	    }
    };

//Bootstrap CSS Imports
gulp.task( "bootstrap:css", function () {

	"use strict";

	var _BS_MIXINS = gulp
		.src( [ _BS_CSS + "mixins/*" ] )
		.pipe( gulp.dest( "./dev/sass/vendor/bs/mixins" ) );

	var _BS_UTIL = gulp
		.src( [ _BS_CSS + "utilities/*" ] )
		.pipe( gulp.dest( "./dev/sass/vendor/bs/utilities" ) );

	var _BS_SCSS_FILES = gulp
		.src( addPaths( _BS_CSS_MUST_IMPORT, _BS_ADDITIONAL_IMPORT ) )
		.pipe( gulp.dest( "./dev/sass/vendor/bs" ) );

	return _BS_MIXINS + _BS_UTIL + _BS_SCSS_FILES;

} );

//Import Plugin CSS
gulp.task( "plugin:css", function () {

	"use strict";

	var owlAssets = "";
	// COMMENT OUT WHAT YOU DON'T NEED
	var _styles = [
		_PLUGINS._dataTables.styles,
		_PLUGINS._owlCarousel.styles.required,
		_PLUGINS._owlCarousel.styles.additional
	];

	var _PLUGIN_STYLES = gulp
		.src( addPaths( _styles ) )
		// We need to convert these to .scss files
		.pipe( rename( {
			prefix:  "_",
			suffix:  "-convert",
			extname: ".scss"
		} ) )
		.pipe( gulp.dest( "./dev/sass/vendor/plugins" ) );

	if ( _styles.includes( _PLUGINS._owlCarousel.styles.required ) )
		owlAssets = gulp
			.src( addPaths(
				_PLUGINS._owlCarousel.media
			) )
			.pipe( gulp.dest( _PROJ_IMG ) );

	return _PLUGIN_STYLES + owlAssets;

} );

// Impost Plugin JS
gulp.task( "plugin:js", function () {

	"use strict";

	var COPY_PLUGIN_SCRIPTS       = "",
	    COPY_PLUGIN_ADDON_SCRIPTS = "",
	    COPY_BS_SCRIPTS           = "";

	// COMMENT OUT WHAT YOU DON'T NEED
	var _PLUGIN_SCRIPTS = [
		// DO NOT UNCOMMENT THIS!
		_PLUGINS._skipLinkFocus.scripts, // Accessibility for "Skip to content" links

		// Can uncomment what you need.
		_PLUGINS._dataTables.scripts.required, // Interactive table
		_PLUGINS._fancybox.scripts, // Lightbox Plugin
		_PLUGINS._mixitup.scripts, // Filter Plugin
		_PLUGINS._owlCarousel.scripts, // Slider
		_PLUGINS._scrollReveal.scripts, // Similar to lazyload but for elements
		//
	];

	var _PLUGIN_SCRIPTS_ADDONS = [
		// _PLUGINS._dataTables.scripts.bs4,
	];

	COPY_PLUGIN_SCRIPTS = gulp
		.src( addPaths( _PLUGIN_SCRIPTS ) )
		.pipe( gulp.dest( "./dev/js/core/plugins" ) );

	if ( _PLUGIN_SCRIPTS.includes( _PLUGINS._dataTables.scripts.required ) ) {
		COPY_PLUGIN_ADDON_SCRIPTS = gulp
			.src( addPaths( _PLUGIN_SCRIPTS_ADDONS ) )
			.pipe( gulp.dest( "./dev/js/core" ) );
	}

	COPY_BS_SCRIPTS = gulp
		.src( addPaths( _BS_JS ) )
		.pipe( gulp.dest( "./dev/js/core/bs" ) );

	return COPY_BS_SCRIPTS + COPY_PLUGIN_SCRIPTS + COPY_PLUGIN_ADDON_SCRIPTS;

} );

//Vendor CSS
gulp.task( "vendor:css", function () {

	"use strict";

	var plugins = [
		autoprefixer( {
			browsers: [ "cover 99.5%" ]
		} ),
		cssnano()
	];

	return gulp
		.src( [ "./dev/sass/application-vendor.scss" ] )
		.pipe( flatten() )
		.pipe( newer( "./dev/sass/vendor/**/*" ) )
		.pipe( sourcemaps.init() )
		.pipe( globbing( {
			extensions: ".scss"
		} ) )
		.pipe( sass().on( "error", sass.logError ) )
		.pipe( postcss( plugins ) )
		.pipe( rename( {
			suffix: ".min",
		} ) )
		.on( "error", handleError )
		// .pipe( sourcemaps.write( "./" ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( _PROJ_CSS ) )
		.pipe( browserSync.stream() );
} );

// Default CSS
gulp.task( "application:css", function () {

	"use strict";

	var plugins = [
		autoprefixer( {
			browsers: [ "cover 99.5%" ]
		} ),
		cssnano()
	];

	return gulp
		.src( [ "dev/sass/application.scss" ] )
		.pipe( flatten() )
		.pipe( newer( "dev/sass/**/*" ) )
		.pipe( sourcemaps.init() )
		.pipe( globbing( {
			extensions: ".scss"
		} ) )
		.pipe( sass().on( "error", sass.logError ) )
		.pipe( postcss( plugins ) )
		.pipe( rename( {
			suffix: ".min",
		} ) )
		// .pipe( sourcemaps.write( "./" ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( _PROJ_CSS ) )
		.on( "error", handleError )
		.pipe( browserSync.stream() );

} );

// Compile vendor scripts
gulp.task( "vendor:js", function () {

	"use strict";

	return gulp
		.src( [ "dev/js/core/**/*.js", "dev/js/core/*.js" ] )
		.pipe( sourcemaps.init() )
		.pipe( concat( "application-vendor.js" ) )
		.pipe( uglify() )
		.pipe( rename( {
			suffix: ".min"
		} ) )
		.pipe( strip() )
		// .pipe( sourcemaps.write('./') )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( _PROJ_JS ) )
		.on( "error", handleError )
		.pipe( browserSync.stream() );
} );

// Compile custom Scripts
gulp.task( "application:js", function () {

	"use strict";

	return gulp
		.src( [ "dev/js/scripts/*.js" ] )
		.pipe( sourcemaps.init() )
		.pipe( concat( "application.js" ) )
		.pipe( uglify() )
		.pipe( rename( {
			suffix: ".min"
		} ) )
		.pipe( strip() )
		// .pipe( sourcemaps.write('./') )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( _PROJ_JS ) )
		.on( "error", handleError )
		.pipe( browserSync.stream() );
} );

// Theme Functions
gulp.task( "wp:theme:functions", function () {

	"use strict";

	return gulp
		.src( [ proj_dir + "/inc/core/basic/*.php" ] )
		.pipe( concat( "theme-functions.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( _PROJ_PHP + "/theme/" ) );
} );

// Field Groups
gulp.task( "wp:theme:field_groups", function () {

	"use strict";

	return gulp
		.src( [ proj_dir + "/inc/core/acf/field-groups/*.php" ] )
		.pipe( concat( "theme-field-groups.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( _PROJ_PHP + "/theme/" ) );
} );

// Custom Functions
gulp.task( "wp:custom", function () {

	"use strict";

	return gulp
		.src( [ proj_dir + "/inc/custom/**/*.php" ] )
		.pipe( concat( "custom-functions.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( _PROJ_PHP + "/custom/" ) );
} );

// Custom Post Type
gulp.task( "wp:custom:posts", function () {

	"use strict";

	return gulp
		.src( [ proj_dir + "/inc/cpt/**/*.php" ] )
		.pipe( concat( "custom-post-types.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( _PROJ_PHP + "/custom/" ) );
} );

// File Watcher
gulp.task( "project:watcher", function () {

	"use strict";

	// Compile our Vendor SCSS files
	gulp
		.watch( [ "dev/sass/vendor/**/*.scss" ], [ "vendor:css" ] );

	// Compile our Vendor JS files
	gulp
		.watch( [ "dev/js/scripts/core/bs/*.js", "dev/js/scripts/core/plugins/**/*.js" ], [ "vendor:js" ] );

	// Watch Custom SCSS files
	gulp
		.watch( [ "dev/sass/**/**/*.scss", "!dev/sass/vendor/**/*.scss" ], [ "application:css" ] );

	// Watch Custom JS files
	gulp
		.watch( [ "dev/js/scripts/**/*.js", "!dev/js/scripts/core/bs/*.js", "!dev/js/scripts/core/plugins/**/*.js" ], [ "application:js" ] );

	// PHP Functions
	gulp.watch( proj_dir + "/inc/core/**/*.php", [ "wp:theme:functions", "wp:theme:field_groups" ] );
	gulp.watch( [ proj_dir + "/inc/custom/**/*.php" ], [ "wp:custom" ] );
	gulp.watch( [ proj_dir + "/inc/cpt/**/*.php" ], [ "wp:custom:posts" ] );

	// Reload page when php, css, or js files change.
	gulp.watch( [ _PROJ_PHP + "/*.php", ] ).on( "change", reload );
	gulp.watch( [ _PROJ_CSS + "/*.min.css" ] ).on( "change", reload );
	gulp.watch( [ _PROJ_JS + "/*.min.js" ] ).on( "change", reload );

} );

// Open the port and browser
gulp.task( "project:open", function () {

	"use strict";

	var files = [
		"../**/*.php",
		"../**/*.{png,jpg,gif}"
	];

	var https_params = false;

	if ( ssl_key.length > 0 ) {
		https_params = {
			key:  ssl_key,
			cert: ssl_cert
		};
	}

	browserSync.init( files, {
		proxy:         url,
		injectChanges: true,
		https:         https_params,
		notify:        false,
	} );

} );

// Error reporting function
function handleError (err) {

	"use strict";

	console.log( err.toString() );
	this.emit( "end" );
}

gulp.task(
	"default",
	sequence(
		// Copy our needed files
		[
			"bootstrap:css",
			"plugin:css",
			"plugin:js"
		],
		// Start compiling our files
		[
			"wp:theme:functions",
			"wp:theme:field_groups",
			"wp:custom",
			"wp:custom:posts",
		],
		// Start compiling our CSS and JS files.
		[
			"vendor:css",
			"vendor:js",
			"application:js",
			"application:css",
		],
		// Serve our site
		"project:open",
		// Watch for changes in our files.
		"project:watcher",
	)
);