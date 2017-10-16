var gulp = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
globbing = require('gulp-css-globbing'),
sourcemaps = require('gulp-sourcemaps'),
imagemin = require('gulp-imagemin'),
flatten = require('gulp-flatten'),
newer = require('gulp-newer'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
connect = require('gulp-connect'),
open = require('gulp-open'),
svg = require('gulp-svg-sprite'),
fileinclude = require('gulp-file-include'),
livereload = require('gulp-livereload'),
filter    = require('gulp-filter'),
gutil = require('gulp-util'),
path = require('path'),

// Give a project path
proj_dir = '',
// Give a theme path if WP
theme_dir = '';

//Vendor CSS
gulp.task('vendor-css', function() {
	return gulp.src('dev/sass/application-vendor.scss')
		.pipe(flatten())
		.pipe(newer('dev/sass/vendor/*'))
		.pipe(sourcemaps.init())
		.pipe(globbing({extensions: '.scss'}))
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({cascade: false}))
		.pipe(sourcemaps.write())
		.on('error', handleError)
		.pipe(gulp.dest('public/css'))
		// Uncomment for Non-WP
		// .pipe(gulp.dest('../' + proj_dir + '/css'))
		// Uncomment for WP
		// .pipe(gulp.dest( proj_dir + theme_dir + '/assets/css'))
		;
});

// Default CSS
gulp.task('css', function() {
  return gulp.src('dev/sass/application.scss')
	  .pipe(flatten())
	  .pipe(newer('dev/sass/**/*'))
	  .pipe(sourcemaps.init())
	  .pipe(globbing({extensions: '.scss'}))
	  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	  .pipe(autoprefixer({cascade: false}))
	  .pipe(sourcemaps.write())
	  .on('error', handleError)
	  .pipe(gulp.dest('public/css'))
		// Uncomment for Non-WP
		// .pipe(gulp.dest('../' + proj_dir + '/css'))
	  // Uncomment for WP
	  // .pipe(gulp.dest('../' + proj_dir + '/wp-content/themes/' + theme_dir + '/assets/css'))
	;
});

gulp.task('vendor-js', function() {
  return gulp.src(['dev/js/vendor/*.js'])
	  .pipe(sourcemaps.init())
	  .pipe(concat('application-vendor.js'))
	  .pipe(uglify())
	  .pipe(sourcemaps.write())
	  .on('error', handleError)
	  .pipe(gulp.dest('public/js'))
		// Uncomment for Non-WP
		// .pipe(gulp.dest('../' + proj_dir + '/js'))
	  // Uncomment for WP
	  // .pipe(gulp.dest('../' + proj_dir + '/wp-content/themes/' + theme_dir + '/assets/js'))
	;
});

gulp.task('js', function() {
  return gulp.src(['dev/js/*.js',
                   'dev/js/**/*.js',
                   '!dev/js/vendor/*.js'])
	  .pipe(sourcemaps.init())
	  .on('error', handleError)
	  .pipe(concat('application.js'))
	  .pipe(sourcemaps.write())
	  .pipe(gulp.dest('public/js'))
		// Uncomment for Non-WP
		// .pipe(gulp.dest('../' + proj_dir + '/js'))
	  // Uncomment for WP
	  // .pipe(gulp.dest('../' + proj_dir + '/wp-content/themes/' + theme_dir + '/assets/js'))
	;
});

gulp.task('media-files', function() {
  return gulp.src(['dev/media/**/*',
                   '!dev/media/**/*.{jpg,jpeg,png,gif,ico,svg}'])
	  .pipe(flatten())
	  .pipe(newer('public/media'))
	  .on('error', handleError)
	  .pipe(gulp.dest('public/media'))
	  // Uncomment for WP
	  // .pipe(gulp.dest('../' + proj_dir + '/wp-content/themes/' + theme_dir + '/assets/img'))
});

gulp.task('html',  function() {
  return gulp.src('dev/html/*.html')
	  .pipe(fileinclude({
	    prefix: '@@',
	    basepath: '@file'
	  }))
	  .on('error', handleError)
	  .pipe(newer('public/*.html'))
	  .on('error', handleError)
	  .pipe(gulp.dest('public/'));
});

// gulp.task('open', function(){
//   setTimeout(function(){
//     gulp.src('')
//     .pipe(open({ uri: 'http://cantigny'}));
//   }, 5000);
// });

gulp.task('connect', function() {
	gulp.watch('dev/sass/vendor/*.scss', ['vendor-css']);
  gulp.watch('dev/sass/**/**/*.scss', ['css']);
  gulp.watch('dev/js/vendor/*.js', ['vendor-js']);
  gulp.watch(['dev/js/**/*.js', '!dev/js/vendor/*.js'], ['js']);

	// livereload.listen();
	//
	// gulp.watch(['dev/js/**/*.js', 'public/css/*.css']).on('change', livereload.changed);

});

// Error reporting function
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('default', [ 'vendor-css', 'css', 'vendor-js', 'js', 'connect' ]);
