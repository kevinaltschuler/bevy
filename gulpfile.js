var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('serve', function() {
	nodemon({
		  script: 'app.js'
		, ext: 'html js'
		, env: {
			'NODE_ENV': 'development'
		}
	}).on('restart', function() {
		console.log('restarted!');
	});
});

gulp.task('default', function() {

});
