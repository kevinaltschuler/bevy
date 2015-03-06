'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		app: './public/js/index.js',
		login: './public/js/login/login-index.js',
		register: './public/js/register/register-index.js'
	},
	output: {
		path: path.join(__dirname, "public/js/build"),
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, loaders: ['jsx-loader?harmony'], exclude: /node_modules/ }
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	resolveLoader: {
		modulesDirectories: ['node_modules']
	}
};
