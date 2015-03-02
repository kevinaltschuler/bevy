'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: [
		'./public/js/index.js'
	],
	output: {
		path: path.join(__dirname, "public/js/build"),
		filename: 'bundle.js'
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
