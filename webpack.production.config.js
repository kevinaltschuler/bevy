'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		app: './public/js/index.js'
	},
	output: {
		path: path.join(__dirname, "public/js/build"),
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel?presets[]=react,presets[]=es2015'],
				exclude: /node_modules/
			},
			//{ test: /.*\/public\/.*\.js$/, loaders: ['uglify-loader'], exclude: /node_modules/ }
		]
	},
	resolve: {
		alias: {
			"react": __dirname + '/node_modules/react'
		},
		extensions: ['', '.js', '.jsx']
	},
	resolveLoader: {
		modulesDirectories: ['node_modules']
	},
	plugins: [
		/*new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			mangle: {
				except: ['require', 'exports', '$', '_']
			}
		})*/
	]
};
