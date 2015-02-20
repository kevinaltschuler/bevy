'use strict';

var gulp = require('gulp');

var fs = require('fs');

var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

var nodemon = require('gulp-nodemon');


var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var webpackProductionConfig = require('./webpack.production.config.js');


gulp.task('webpack:build', function(callback) {
  //Run webpack.
  webpack(webpackProductionConfig, function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({ colors: true }));
		callback();
		return;
	});
});

var devCompiler = webpack(webpackConfig);
gulp.task('webpack:build-dev', function(callback) {
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({ colors: true }));
		callback();
		return;
	});
	return;
});

var devServer = {};
gulp.task('webpack-dev-server', function(callback) {
	devServer = new WebpackDevServer(webpack(webpackConfig), {
		  contentBase: 'public/'
		//, publicPath: '/scripts/'
		, hot: true
		, watchDelay: 100
		, stats: { colors: true }
		, noInfo: true
	});
	devServer.listen(80, 'localhost', function(err) {
		if(err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'http://localhost:80');
		callback();
	});
	return;
});

gulp.task('watch', ['webpack-dev-server', 'less']);

gulp.task('less', function() {
	gulp.watch(['public/less/*.less', 'public/less/**/*.less'], function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		buildLess();
	});
});


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
gulp.task('build', ['webpack:build'], function() {

	// log files
	fs.open('./log', 'r', function(err, fd) {
		if(err) {
			console.log('no log folder found. creating log folder...');
			fs.mkdirSync('./log');
		}
	});

	//less
	buildLess();
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
