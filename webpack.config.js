'use strict';

var webpack = require('webpack');
var path = require('path');

var LessGlobPlugin = require('less-plugin-glob');

module.exports = {
	entry: {
		app: ['webpack-dev-server/client?http://localhost:8888',
		'webpack/hot/only-dev-server',
		'./public/js/index']
	},
	output: {
		path: path.join(__dirname, '/public/'),
		filename: '[name].bundle.js',
		publicPath: 'http://localhost:8888/build'
	},
	module: {
		loaders: [
			{ test: /\.less$/, loader: "style!css!less?noIeCompat", exclude: /node_modules/ },
			{ test: /\.(woff|woff2|ttf|eot|svg)/, loader: "url?prefix=font/&limit=5000" },
			{
				test: /\.jsx?$/,
				loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		alias: {
			"react": __dirname + '/node_modules/react'
		},
		extensions: ['', '.js', '.jsx']
	},
	debug: true,
	devtool: "eval",
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		//new webpack.IgnorePlugin(/vertx/) // https://github.com/webpack/webpack/issues/353
	]
};
