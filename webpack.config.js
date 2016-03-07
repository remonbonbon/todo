const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const BUILD = [
	{type: 'js',   entry: './src/index.js'},
	{type: 'css',  entry: './src/index.scss'},
	{type: 'html', entry: './src/index.jade'},
];

const IS_DEBUG = process.env.NODE_ENV !== 'production';

module.exports = {
	context: __dirname,
	entry: BUILD.reduce((result, a) => {
		// Create JS and CSS entries
		const basename = path.basename(a.entry, path.extname(a.entry));
		if ('js'  === a.type) result[basename + '.js'] = a.entry;
		if ('css' === a.type) result[basename + '.css'] = a.entry;
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
		const basename = path.basename(a.entry, path.extname(a.entry));
		if ('html' === a.type) {
			return new HtmlWebpackPlugin({
				filename: basename + '.html',
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
