var url = 'https://base.app/', // Your testing URL
	proj_dir = '../wp-content/themes/base', // Give a project path
	theme_name = 'base', // Give a theme path if WP
	// EXAMPLE
	// ssl_key = '/Users/username/.valet/Certificates/domain.TLS.key',
	ssl_key = '/Users/nmak/.valet/Certificates/mcshane.app.key', // Replace with path for your SSL key
	ssl_cert = '/Users/nmak/.valet/Certificates/mcshane.app.crt', // Replace with path for your SSL key
	gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	globbing = require( 'gulp-css-globbing' ),
	sourcemaps = require( 'gulp-sourcemaps' ),
	imagemin = require( 'gulp-imagemin' ),
	flatten = require( 'gulp-flatten' ),
	newer = require( 'gulp-newer' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	svg = require( 'gulp-svg-sprite' ),
	fileinclude = require( 'gulp-file-include' ),
	filter = require( 'gulp-filter' ),
	gutil = require( 'gulp-util' ),
	path = require( 'path' ),
	browserSync = require( 'browser-sync' ),
	reload = browserSync.reload;

//Vendor CSS
gulp.task( 'vendor-css', function() {
	return gulp.src( 'dev/sass/application-vendor.scss' )
		.pipe( flatten() )
		.pipe( newer( 'dev/sass/vendor/*' ) )
		.pipe( sourcemaps.init() )
		.pipe( globbing( { extensions: '.scss' } ) )
		.pipe( sass( { outputStyle: 'compressed' } ).on( 'error', sass.logError ) )
		.pipe( autoprefixer({
			flexbox: true,
			cascade: false,
			browsers: ['last 2 versions'],
			add : true,
			remove: false,
		}) )
		.pipe( sourcemaps.write() )
		.on( 'error', handleError )
		.pipe( gulp.dest( proj_dir + '/assets/css' ) )
		;
} );

// Default CSS
gulp.task( 'css', function() {
	return gulp.src( 'dev/sass/application.scss' )
		.pipe( flatten() )
		.pipe( newer( 'dev/sass/**/*' ) )
		.pipe( sourcemaps.init() )
		.pipe( globbing( { extensions: '.scss' } ) )
		.pipe( sass( { outputStyle: 'compressed' } ).on( 'error', sass.logError ) )
		.pipe( autoprefixer( {
			flexbox: true,
			cascade: false,
			browsers: ['last 2 versions'],
			add : true,
			remove: false,
		} ) )
		.pipe( sourcemaps.write() )
		.on( 'error', handleError )
		.pipe( gulp.dest( proj_dir + '/assets/css' ) )
		;
} );

gulp.task( 'vendor-js', function() {
	return gulp.src( [ 'dev/js/vendor/*.js' ] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'application-vendor.js' ) )
		.pipe( uglify() )
		.pipe( sourcemaps.write() )
		.on( 'error', handleError )
		.pipe( gulp.dest( proj_dir + '/assets/js' ) )
		;
} );

gulp.task( 'js', function() {
	return gulp.src( [ 'dev/js/scripts/*.js' ] )
		.pipe( sourcemaps.init() )
		.pipe( concat( 'application.js' ) )
    .pipe( uglify() )
		.pipe( sourcemaps.write() )
    .on( 'error', handleError )
		.pipe( gulp.dest( proj_dir + '/assets/js' ) )
		;
} );

gulp.task( 'theme-functions', function() {
  return gulp.src( [ proj_dir + '/inc/core/basic/*.php' ] )
    .pipe( concat( 'theme-functions.php', {
      newLine: '\n?>\n'
    } ) )
    .on( 'error', handleError )
    .pipe( gulp.dest( proj_dir + '/inc/compiled/theme/' ) )
    ;
} );

gulp.task( 'field-groups', function() {
  return gulp.src( [ proj_dir + '/inc/core/acf/field-groups/*.php' ] )
    .pipe( concat( 'theme-field-groups.php', {
      newLine: '\n?>\n'
    } ) )
    .on( 'error', handleError )
    .pipe( gulp.dest( proj_dir + '/inc/compiled/theme/' ) )
    ;
} );

gulp.task( 'custom-functions', function() {
  return gulp.src( [ proj_dir + '/inc/custom/**/*.php' ] )
    .pipe( concat( 'custom-functions.php', {
      newLine: '\n?>\n'
    } ) )
    .on( 'error', handleError )
    .pipe( gulp.dest( proj_dir + '/inc/compiled/custom/' ) )
    ;
} );

gulp.task( 'custom-pt', function() {
  return gulp.src( [ proj_dir + '/inc/cpt/**/*.php' ] )
    .pipe( concat( 'custom-post-types.php', {
      newLine: '\n?>\n'
    } ) )
    .on( 'error', handleError )
    .pipe( gulp.dest( proj_dir + '/inc/compiled/custom/' ) )
    ;
} );

gulp.task( 'media-files', function() {
	return gulp.src( [
		'dev/media/**/*',
		'!dev/media/**/*.{jpg,jpeg,png,gif,ico,svg}'
	] )
		.pipe( flatten() )
		.on( 'error', handleError )
		.pipe( gulp.dest( proj_dir + '/assets/img' ) );
} );

gulp.task( 'html', function() {
	return gulp.src( 'dev/html/*.html' )
		.pipe( fileinclude( {
			prefix: '@@',
			basepath: '@file'
		} ) )
		.on( 'error', handleError )
		.on( 'error', handleError );
} );

gulp.task( 'open', function() {

	var files = [
		'../**/*.php',
		'../**/*.{png,jpg,gif}'
	];

	var https_params = false;

	if ( ssl_key.length > 0 ) {
		https_params = {
			key: ssl_key,
			cert: ssl_cert
		};
	}

	browserSync.init( files, {
		proxy: url,
		injectChanges: true,
		https : https_params
	} );

} );

gulp.task( 'watch', function() {

	gulp.watch( 'dev/sass/vendor/*.scss', [ 'vendor-css' ] );
	gulp.watch( 'dev/sass/**/**/*.scss', [ 'css' ] );
	gulp.watch( 'dev/js/vendor/*.js', [ 'vendor-js' ] );
	gulp.watch( [ 'dev/js/**/*.js', '!dev/js/vendor/*.js' ], [ 'js' ] );

	// PHP Functions
  gulp.watch( proj_dir + '/inc/core/**/*.php', ['theme-functions', 'field-groups'] );
  gulp.watch( [proj_dir + '/inc/custom/**/*.php'], ['custom-functions'] );
  gulp.watch( [proj_dir + '/inc/cpt/**/*.php'], ['custom-pt'] );

	gulp.watch( [ proj_dir + '/assets/js/*.js', proj_dir + '/assets/css/*.css' ] ).on( 'change', reload );
	gulp.watch( [ proj_dir + '/inc/compiled/*.php', ] ).on( 'change', reload );

} );

gulp.task( 'reload', [ 'vendor-css', 'css', 'vendor-js', 'js' ], function() {

	browserSync.reload();

} );

// Error reporting function
function handleError( err ) {
	console.log( err.toString() );
	this.emit( 'end' );
}

gulp.task( 'default', [
	'vendor-css',
	'css',
	'vendor-js',
	'js',
	'theme-functions',
	'field-groups',
	'custom-functions',
	'custom-pt',
	// 'open',
	// 'reload',
	'watch'
] );