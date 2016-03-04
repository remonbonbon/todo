'use strict';

const gulp = require('gulp');
const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');
const jade = require('gulp-jade');
const minimist = require('minimist');
const _ = require('lodash');

// Command line options
const OPTIONS = minimist(process.argv.slice(2), {
	boolean: [
		'debug',	// --debug: Run debug build.
	],
	default: {
		debug: false,
	}
});

// Define source & destination
const BUILD = {
	dest: 'build/',
	js: {
		entry: './src/index.js',
		output: 'bundle.js',
	},
	jade: {
		entry: 'src/index.jade',
	},
};

// Babel with webpack
gulp.task('webpack', ()=> gulp.src([BUILD.js.entry])
	.pipe(gulpWebpack({
		watch: true,
		output: {
			filename: BUILD.js.output,
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					loader: 'babel-loader',
					query: {
						presets: ['es2015', 'react'],
					}
				},
				{
					test: /\.css?$/,
					loaders: ['style', 'raw'],
				},
			]
		},
		plugins: _.compact([
			!OPTIONS.debug ? new webpack.optimize.UglifyJsPlugin({
				compress: {warnings: false},
				sourceMap: false,
			}) : null,
			new webpack.DefinePlugin({
				'process.env': {NODE_ENV: '"production"'}
			}),
		]),
	}))
	.pipe(gulp.dest(BUILD.dest))
);

// Compile jade
gulp.task('jade', ()=> gulp.src([BUILD.jade.entry])
	.pipe(jade())
	.pipe(gulp.dest(BUILD.dest))
);

gulp.task('default', [
	'jade',
	'webpack',
]);
