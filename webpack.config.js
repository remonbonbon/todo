const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const BUILD = [
	{type: 'js',   entry: './src/app.js', output: 'bundle.js'},
	{type: 'css',  entry: './src/app.scss', output: 'bundle.css'},
	{type: 'html', entry: './src/index.jade', output: 'index.html'},
];

const IS_DEBUG = process.env.NODE_ENV !== 'production';

module.exports = {
	context: __dirname,
	entry: BUILD.reduce((result, a) => {
		// Create JS and CSS entries
		if ('js'  === a.type) result[a.output] = a.entry;
		if ('css' === a.type) result[a.output] = a.entry;
		return result;
	}, {}),
	output: {
		path: './build',
		filename: '[name]',
	},
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('style', 'css', 'sass')
			},
			{
				test: /\.jade$/,
				loader: 'jade?' + (IS_DEBUG ? 'pretty=true' : ''),
			},
		]
	},
	sassLoader: {
		outputStyle: IS_DEBUG ? 'nested' : 'compressed'
	},
	plugins: BUILD.map((a) => {
		// Create HtmlWebpackPlugin for jade entries
		if ('html' === a.type) {
			return new HtmlWebpackPlugin({
				filename: a.output,
				template: a.entry,
				inject: false,
			});
		}
	}).concat([
		// Output CSS file
		new ExtractTextPlugin('[name]'),
		// Force process.env.NODE_ENV = 'production'
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"production"'
			}
		}),
		// Uglify when production mode
		IS_DEBUG ? null : new webpack.optimize.UglifyJsPlugin({
			compress: {warnings: false}
		}),
	]).filter((p) => p),
}
