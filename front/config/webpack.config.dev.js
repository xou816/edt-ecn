const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
	entry: path.resolve(__dirname, '../src/index.jsx'),
	devServer: {
		contentBase: path.resolve(__dirname, '../../dist/public'),
		watchContentBase: true,
		proxy: {
			'/api': 'http://localhost:3000'
		}
	},
	output: {
		filename: 'compiled.js',
		path: path.resolve(__dirname, '../../dist/public'),
		publicPath: '/'
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
			use: [{
				loader: "style-loader"
			}, {
				loader: "css-loader"
			}, {
				loader: "sass-loader"
			}]
		},
		]
	},
	plugins: [
	new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"development"' }}),
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, '../src/index.html')
	}),
	new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
		extensions: ['.js', '.jsx'],
	},
};