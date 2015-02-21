'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: [
		'webpack-dev-server/client?http://localhost:8888',
		'webpack/hot/only-dev-server',
		'./public/js/index'
	],
	output: {
		path: path.join(__dirname, '/public/'),
		filename: 'bundle.js',
		publicPath: 'http://localhost:8888/build'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ }
		]
	},
	resolve: {
		extensions: ['', '.js']
	},
	debug: true,
	devtool: "eval",
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		//new webpack.IgnorePlugin(/vertx/) // https://github.com/webpack/webpack/issues/353
	]
};
