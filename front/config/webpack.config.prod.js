const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
	entry: path.resolve(__dirname, '../src/index.jsx'),
	output: {
		filename: 'bundle.[chunkhash:8].js',
		path: path.resolve(__dirname, '../../dist/public'),
		publicPath: '/public'
	},
	module: {
		rules: [
		{
			test: /\.(js|jsx)$/,
			include: path.resolve(__dirname, '../src'),
			exclude: /node_modules/,
			loaders: 'babel-loader'
		},
		// {
		// 	test: /\.(ts|tsx)?$/,
		// 	use: 'ts-loader',
		// 	exclude: /node_modules/,
		// 	include: path.resolve(__dirname, '../src'),
		// },
		{
			test: /\.scss$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'sass-loader']
			})
		},
		]
	},
	plugins: [
	new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"prod"' }}),
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, '../src/index.html')
	}),
	new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },        
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: true,
    }),
    new ExtractTextPlugin({
      filename: 'style.[contenthash:8].css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    })
	],
	resolve: {
		extensions: ['.js', '.jsx'],
	},
};