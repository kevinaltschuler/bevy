var gulp = require('gulp');

var gutil = require('gulp-util');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var to5ify = require('6to5ify');
var reactify = require('reactify');
var watchify = require('watchify');

var browserSync = require('browser-sync');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


gulp.task('watch', ['less', 'js']);

gulp.task('js', function () {
	var b = browserify({
		  cache: {}
		, packageCache: {}
		, fullPaths: true
	});
	b = watchify(b);
	b.on('update', function() {
		return bundleShare(b);
	});
	b.on('log', function(msg) {
		console.log('BROWSERIFY ::', msg);
	})
	b.transform(reactify);
	b.transform(to5ify);
	b.add('./public/js/index.js');
	return bundleShare(b);
});

function bundleShare(b) {
	var stream = b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./public/js/build'));
	browserSync.reload();
	return stream;
}

gulp.task('less', function() {
	var stream = gulp.src('public/less/app.less')
		.pipe(watch('public/less/*.less'))
		.pipe(less())
		// now do css transformations
		.pipe(autoprefixer({
			  browser: ['last 2 versions']
			, cascade: true
		}))
		.pipe(gulp.dest('public/css'));
	return stream;
});


// build task for a one-timer
gulp.task('build', function() {
	// less
	gulp.src('public/less/app.less')
		.pipe(less())
		.pipe(gulp.dest('public/css'));

	// js
	var b = browserify();
	b.transform(reactify);
	b.transform(to5ify);
	b.add('./public/js/index.js');
	b.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./public/js/build'));
});

gulp.task('serve', function() {
	nodemon({
		  verbose: true
		, script: 'app.js'
		, ext: 'html js jade'
		, env: {
			  'NODE_ENV': 'development'
			, 'COOKIE_SECRET': 'foobar'
			, 'SESSION_SECRET': 'foobar'
		}
		, watch: [
			  './*.*'
			, './routes/*.*'
			, './routes/**/*.*'
			, './views/*.*'
			, './views/**/*.*'
			, './models/*.*'
			, './middleware/*.*'
			, './config/*.*'
			, './api/**/*.*'
			, './api/*.*'
		]
		, ignore: [
			  './public/*.*'
			, './public/**/*.*'
			, './public/js/build/bundle.js'
			, './gulpfile.js'
		]
	}).on('restart', function() {
		console.log('restarted!');
	});
});

//gulp.task('watch', function() {
//	gulp.watch(["*.js", "*.jsx"], ['compile', browserSync.reload]);
//});

gulp.task('default', function() {

});
