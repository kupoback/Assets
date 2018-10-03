var url                   = "https://domain.app/", // Your testing URL
    proj_dir              = "../wp-content/themes/domain", // Give a project path
    theme_name            = "domain", // Give a theme path if WP
    // EXAMPLE
    // ssl_key = '/Users/username/.valet/Certificates/domain.TLS.key',
    ssl_key               = "/Users/nmak/.valet/Certificates/domain.app.key", // Replace with path for your SSL key
    ssl_cert              = "/Users/nmak/.valet/Certificates/domain.app.crt", // Replace with path for your SSL key
    gulp                  = require( "gulp" ),
    sass                  = require( "gulp-sass" ),
    autoprefixer          = require( "gulp-autoprefixer" ),
    globbing              = require( "gulp-css-globbing" ),
    sourcemaps            = require( "gulp-sourcemaps" ),
    flatten               = require( "gulp-flatten" ),
    rename                = require( "gulp-rename" ),
    newer                 = require( "gulp-newer" ),
    concat                = require( "gulp-concat" ),
    uglify                = require( "gulp-uglify" ),
    browserSync           = require( "browser-sync" ),
    reload                = browserSync.reload,
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
    ],
    _BS_JS                = _BS_DIR + "/dist/js/bootstrap.bundle.min.js",
    _PLUGINS              = {
	    _dataTables:    {
		    scripts: {
			    required: _NPM_DIR + "/datatables.net/js/jquery.dataTables.js",
			    bs4:      _NPM_DIR + "/datatables.net-bs4/js/dataTables.bootstrap4.js"
		    },
		    styles:  _NPM_DIR + "/datatables.net-bs4/css/dataTables.bootstrap4.css"
	    },
	    _fancybox:      {
		    scripts: _NPM_DIR + "/@fancyapps/fancybox/dist/jquery.fancybox.js",
		    styles:  _NPM_DIR + "/@fancyapps/fancybox/dist/jquery.fancybox.css"
	    },
	    _owlCarousel:   {
		    scripts: _NPM_DIR + "/owl-carousel-2/owl.carousel.js",
		    styles:  {
			    required:   _NPM_DIR + "/owl-carousel-2/assets/owl.carousel.css",
			    additional: _NPM_DIR + "/owl-carousel-2/assets/owl.theme.default.css",
		    },
		    media:   _NPM_DIR + "/owl-carousel-2/assets/*.{jpg,png,gif}",
	    },
	    _scrollReveal:  {
		    scripts: _NPM_DIR + "/scrollreveal/dist/scrollreveal.js"
	    },
	    _skipLinkFocus: {
		    scripts: _NPM_DIR + "/skip-link-focus/skip-link-focus.js"
	    }
    };

//Bootstrap CSS Imports
gulp.task( "bootstrap:css", function () {
	
	var _BS_MIXINS = gulp
		.src( [
			_BS_CSS + "mixins/*",
		] )
		.pipe( gulp.dest( "./dev/sass/vendor/bs/mixins" ) );
	
	var _BS_UTIL = gulp
		.src( [
			_BS_CSS + "utilities/*",
		] )
		.pipe( gulp.dest( "./dev/sass/vendor/bs/utilities" ) );
	
	var _BS_SCSS_FILES = gulp
		.src( addPaths( _BS_CSS_MUST_IMPORT, _BS_ADDITIONAL_IMPORT ) )
		.pipe( gulp.dest( "./dev/sass/vendor/bs" ) );
	
	return _BS_MIXINS + _BS_UTIL + _BS_SCSS_FILES;
	
} );

//Import Plugin CSS
gulp.task( "plugin:css", function () {
	
	var owlAssets = "";
	var _styles = [
		// _PLUGINS._dataTables.styles,
		_PLUGINS._fancybox.styles,
		_PLUGINS._owlCarousel.styles.required,
		_PLUGINS._owlCarousel.styles.additional
	];
	
	// COMMENT OUT WHAT YOU DON'T NEED
	var _PLUGIN_STYLES = gulp
		.src( addPaths( _styles ) )
		// We need to convert these to .scss files
		.pipe( rename( {
			suffix:  "-convert",
			extname: ".scss"
		} ) )
		.pipe( gulp.dest( "./dev/sass/vendor/plugins" ) );
	
	if ( _styles.includes( _PLUGINS._owlCarousel.styles.required ) )
		owlAssets = gulp
			.src( addPaths(
				_PLUGINS._owlCarousel.media
			) )
			.pipe( gulp.dest( proj_dir + "/assets/img" ) );
	
	return _PLUGIN_STYLES + owlAssets;
	
} );

//Vendor CSS
gulp.task( "vendor:css", function () {
	return gulp
		.src( "dev/sass/application-vendor.scss" )
		.pipe( flatten() )
		.pipe( newer( "dev/sass/vendor/*" ) )
		.pipe( sourcemaps.init() )
		.pipe( sourcemaps.identityMap() )
		.pipe( globbing( {
			extensions: ".scss"
		} ) )
		.pipe( sass( {
			outputStyle: "compressed"
		} ).on( "error", sass.logError ) )
		.pipe( autoprefixer( {
			flexbox:  true,
			cascade:  false,
			browsers: [ "last 2 versions" ],
			add:      true,
			remove:   false,
		} ) )
		.pipe( rename( {
			suffix: ".min",
		} ) )
		.pipe( sourcemaps.write( "./" ) )
		.on( "error", handleError )
		.pipe( gulp.dest( proj_dir + "/assets/css" ) );
} );

// Default CSS
gulp.task( "application:css", function () {
	return gulp
		.src( "dev/sass/application.scss" )
		.pipe( flatten() )
		.pipe( newer( "dev/sass/**/*" ) )
		.pipe( sourcemaps.init() )
		.pipe( sourcemaps.identityMap() )
		.pipe( globbing( {
			extensions: ".scss"
		} ) )
		.pipe( sass( {
			outputStyle: "compressed"
		} ).on( "error", sass.logError ) )
		.pipe( autoprefixer( {
			flexbox:  true,
			cascade:  false,
			browsers: [ "last 2 versions" ],
			add:      true,
			remove:   false,
		} ) )
		.pipe( rename( {
			suffix: ".min",
		} ) )
		.pipe( sourcemaps.write( "./" ) )
		.on( "error", handleError )
		.pipe( gulp.dest( proj_dir + "/assets/css" ) )
		;
} );

// Impost Plugin JS
gulp.task( "plugin:js", function () {
	
	// COMMENT OUT WHAT YOU DON'T NEED
	var _PLUGIN_SCRIPTS = [
		_PLUGINS._dataTables.scripts.required,
		_PLUGINS._dataTables.scripts.bs4,
		_PLUGINS._fancybox.scripts,
		_PLUGINS._owlCarousel.scripts,
		_PLUGINS._scrollReveal.scripts,
		_PLUGINS._skipLinkFocus.scripts
	];
	
	var COPY_PLUGIN_SCRIPTS = gulp
		.src( addPaths( _PLUGIN_SCRIPTS ) )
		.pipe( gulp.dest( "./dev/js/core/plugins" ) );
	
	var COPY_BS_SCRIPTS = gulp
		.src( addPaths( _BS_JS ) )
		.pipe( gulp.dest( "./dev/js/core/bs" ) );
	
	return COPY_BS_SCRIPTS + COPY_PLUGIN_SCRIPTS;
	
} );

// Compile vendor scripts
gulp.task( "vendor:js", function () {
	return gulp
		.src( [ "dev/js/core/**/*.js", "dev/js/core/*.js" ] )
		.pipe( sourcemaps.init() )
		.pipe( sourcemaps.identityMap() )
		.pipe( concat( "application-vendor.js" ) )
		.pipe( uglify() )
		.on( "error", handleError )
		.pipe( rename( {
			suffix: ".min"
		} ) )
		.pipe( sourcemaps.write( "./" ) )
		.pipe( gulp.dest( proj_dir + "/assets/js" ) );
} );

// Compile custom Scripts
gulp.task( "application:js", function () {
	return gulp
		.src( [ "dev/js/scripts/*.js" ] )
		.pipe( sourcemaps.init() )
		.pipe( sourcemaps.identityMap() )
		.pipe( concat( "application.js" ) )
		.pipe( uglify() )
		.pipe( rename( {
			suffix: ".min"
		} ) )
		.pipe( sourcemaps.write( "./" ) )
		.on( "error", handleError )
		.pipe( gulp.dest( proj_dir + "/assets/js" ) );
} );

// Theme Functions
gulp.task( "wp:theme:functions", function () {
	return gulp
		.src( [ proj_dir + "/inc/core/basic/*.php" ] )
		.pipe( concat( "theme-functions.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( proj_dir + "/inc/compiled/theme/" ) );
} );

// Field Groups
gulp.task( "wp:theme:field_groups", function () {
	return gulp
		.src( [ proj_dir + "/inc/core/acf/field-groups/*.php" ] )
		.pipe( concat( "theme-field-groups.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( proj_dir + "/inc/compiled/theme/" ) );
} );

// Custom Functions
gulp.task( "wp:custom", function () {
	return gulp
		.src( [ proj_dir + "/inc/custom/**/*.php" ] )
		.pipe( concat( "custom-functions.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( proj_dir + "/inc/compiled/custom/" ) );
} );

// Custom Post Type
gulp.task( "wp:custom:posts", function () {
	return gulp
		.src( [ proj_dir + "/inc/cpt/**/*.php" ] )
		.pipe( concat( "custom-post-types.php", {
			newLine: "\n?>\n"
		} ) )
		.on( "error", handleError )
		.pipe( gulp.dest( proj_dir + "/inc/compiled/custom/" ) );
} );

gulp.task( "project:open", function () {
	
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
		https:         https_params
	} );
	
} );

gulp.task( "project:watcher", function () {
	
	gulp
		.watch( "dev/sass/vendor/**/*.scss", [ "vendor:css" ] );
	gulp
		.watch( [ "dev/sass/**/**/*.scss", "!dev/sass/vendor/**/*.scss" ], [ "application:css" ] );
	gulp
		.watch( "dev/js/core/**/*.js", [ "vendor:js" ] );
	gulp
		.watch( [ "dev/js/**/*.js", "!dev/js/core/*.js" ], [ "application:js" ] );
	
	// PHP Functions
	gulp.watch( proj_dir + "/inc/core/**/*.php", [ "wp:theme:functions", "wp:theme:field_groups" ] );
	gulp.watch( [ proj_dir + "/inc/custom/**/*.php" ], [ "wp:custom" ] );
	gulp.watch( [ proj_dir + "/inc/cpt/**/*.php" ], [ "wp:custom:posts" ] );
	
	gulp.watch( [ proj_dir + "/assets/js/*.js", proj_dir + "/assets/css/*.css" ] ).on( "change", reload );
	gulp.watch( [ proj_dir + "/inc/compiled/*.php", ] ).on( "change", reload );
	
} );

gulp.task( "project:reload", [ "vendor:css", "application:css", "vendor:js", "application:js" ], function () {
	
	browserSync.reload();
	
} );

// Error reporting function
function handleError (err) {
	console.log( err.toString() );
	this.emit( "end" );
}

gulp.task( "default", [
	"bootstrap:css",
	"plugin:css",
	"plugin:js",
	"vendor:css",
	"application:css",
	"vendor:js",
	"application:js",
	"wp:theme:functions",
	"wp:theme:field_groups",
	"wp:custom",
	"wp:custom:posts",
	"project:open",
	"project:reload",
	"project:watcher"
] );