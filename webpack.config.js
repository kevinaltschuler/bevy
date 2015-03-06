'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		app: ['webpack-dev-server/client?http://localhost:8888',
		'webpack/hot/only-dev-server',
		'./public/js/index'],
		login: './public/js/login/login-index.js'
	},
	output: {
		path: path.join(__dirname, '/public/'),
		filename: '[name].bundle.js',
		publicPath: 'http://localhost:8888/build'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, loaders: ['react-hot', 'jsx?harmony'], exclude: /node_modules/ }
		]
	},
	resolve: {
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
