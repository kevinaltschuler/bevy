'use strict';

var gulp = require('gulp');
var fs = require('fs');

var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');

var nodemon = require('gulp-nodemon');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var webpackProductionConfig = require('./webpack.production.config.js');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


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
		contentBase: 'http://localhost:8888',
		publicPath: webpackConfig.output.publicPath,
		hot: true,
		stats: { colors: true },
		noInfo: true
	});
	devServer.listen(8888, 'localhost', function(err) {
		if(err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'http://localhost:8888');
		callback();
	});
	return;
});


gulp.task('watch', ['webpack-dev-server', 'less:watch', 'serve:dev'], function() {
	/*browserSync.init({
		server: {
			baseDir: './public',
			proxy: 'bevy.dev'
		},
		tunnel: 'bevy',
		open: false
	});*/
});
gulp.task('watch:nohot', ['less:watch', 'webpack:watch', 'serve']);

gulp.task('less:watch', function() {
	gulp.watch(['public/less/*.less', 'public/less/**/*.less'], function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		buildLess();
	});
});

gulp.task('webpack:watch', function() {
	gulp.watch(['public/js/*.js', 'public/js/**/*.js', 'public/js/*.jsx', 'public/js/**/*.jsx'], function(event) {
	  webpack(webpackProductionConfig, function(err, stats) {
			if(err) throw new gutil.PluginError('webpack:build', err);
			gutil.log('[webpack:build]', stats.toString({ colors: true }));
			return;
		});
	});
});

function buildLess() {
	console.log('building less...');
	return gulp.src('public/less/app.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.on('error', function(err){ console.log(err.message); })
		// now do css transformations
		.pipe(autoprefixer({
			  browser: ['last 2 versions']
			, cascade: true
		}))
		.pipe(sourcemaps.write())
		//.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('public/css'))
		.pipe(reload({ stream: true }));
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


gulp.task('serve:dev', function() {
	nodemon({
		script: 'app.js',
		ext: 'html js jade',
		env: {
			'NODE_ENV': 'development',
			'COOKIE_SECRET': 'foobar',
			'SESSION_SECRET': 'foobar'
		},
		ignore: [
			'public/*.*',
			'public/**/*.*'
		]
	}).on('restart', function() {
		console.log('restarted!');
	});
});

gulp.task('serve', function() {
	nodemon({
		script: 'app.js',
		ext: 'html js jade',
		env: {
			'NODE_ENV': 'production',
			'COOKIE_SECRET': 'foobar',
			'SESSION_SECRET': 'foobar'
		}
	}).on('restart', function() {
		console.log('restarted!');
	});
});
