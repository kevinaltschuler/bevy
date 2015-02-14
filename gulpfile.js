var gulp = require('gulp');

var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var reactify = require('reactify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');

gulp.task('serve', function() {
	nodemon({
		  script: 'app.js'
		, ext: 'html js'
		, env: {
			  'NODE_ENV': 'development'
			, 'COOKIE_SECRET': 'foobar'
			, 'SESSION_SECRET': 'foobar'
		}
	}).on('restart', function() {
		console.log('restarted!');
	});
});

gulp.task('compile', function() {
	var b = browserify();
	b.transform(reactify);
	b.add('./public/js/index.js');
	return b.bundle()
		.pipe(source('app.js'))
		.pipe(gulp.dest('./public/js/build'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			base: './'
		}
	});
});

gulp.task('watch', function() {
	gulp.watch(["*.js", "*.jsx"], ['compile', browserSync.reload]);
});

gulp.task('default', function() {

});
