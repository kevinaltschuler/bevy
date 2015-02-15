var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var to5ify = require('6to5ify');
var reactify = require('reactify');
var watchify = require('watchify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('js', bundle); // so you can run `gulp js` to build the file

function bundle() {
	var b = browserify({
		  cache: {}
		, packageCache: {}
		, fullPaths: true
	});
	b = watchify(b);
	b.on('update', function() {
		bundleShare(b);
	});
	b.transform(reactify);
	b.transform(to5ify);
	b.add('./public/js/index.js');
	bundleShare(b);
}

function bundleShare(b) {
	console.log('updating...');
	b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./public/js/build'));
}

gulp.task('serve', function() {
	nodemon({
		  script: 'app.js'
		, ext: 'html js'
		, env: {
			  'NODE_ENV': 'development'
			, 'COOKIE_SECRET': 'foobar'
			, 'SESSION_SECRET': 'foobar'
		}
		, ignore: [
			'./public/js/**'
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
