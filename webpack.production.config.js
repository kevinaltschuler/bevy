'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	//context: __dirname + 'public/js',
	entry: [
		//"webpack-dev-server/client?http://0.0.0.0:8080",
		//'webpack/hot/only-dev-server',
		'./public/js/index.js'
	],
	output: {
		path: path.join(__dirname, "public/js/build"),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			//{ test: /\.css$/, loaders: ['style', 'css']},
			{ test: /\.jsx?$/, loaders: ['jsx-loader?harmony'], exclude: /node_modules/ }
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	resolveLoader: {
		modulesDirectories: ['node_modules']
	},
	debug: true,
	devtool: "eval",
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		//new webpack.IgnorePlugin(/vertx/) // https://github.com/webpack/webpack/issues/353
	]
};
