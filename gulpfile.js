var gulp = require('gulp');

var fs = require('fs');

var gutil = require('gulp-util');
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


gulp.task('watch', function() {
	var js_stream = watchjs();
	var less_watcher = gulp.watch(['public/less/*.less', 'public/less/**/*.less'], function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		buildLess();
	});
});

function watchjs() {
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
}

function bundleShare(b) {
	var stream = b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./public/js/build'));
	browserSync.reload();
	return stream;
}

function buildLess() {
	console.log('building less...');
	gulp.src('public/less/app.less')
		.pipe(less())
		.on('error', function(err){ console.log(err.message); })
		// now do css transformations
		.pipe(autoprefixer({
			  browser: ['last 2 versions']
			, cascade: true
		}))
		.pipe(gulp.dest('public/css'));
	console.log('...done');
}


// build task for a one-timer
gulp.task('build', function() {

	// log files
	fs.open('./log', 'r', function(err, fd) {
		if(err) {
			console.log('no log folder found. creating log folder...');
			fs.mkdirSync('./log');
		}
	});

	//less
	buildLess();

	// js
	console.log('building js...');
	var b = browserify();
	b.transform(reactify);
	b.transform(to5ify);
	b.add('./public/js/index.js');
	b.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./public/js/build'));
	console.log('...done');
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
