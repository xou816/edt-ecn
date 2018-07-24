const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, '../src/client.jsx'),
	output: {
		filename: 'bundle.[chunkhash:8].js',
		path: path.resolve(__dirname, '../build/public'),
		publicPath: '/public'
	},
	module: {
		rules: [
		{
			test: /\.(js|jsx)$/,
			include: path.resolve(__dirname, '../src'),
			exclude: /node_modules/,
			loaders: 'babel-loader'
		}
		]
	},
	plugins: [
	new webpack.EnvironmentPlugin({
		NODE_ENV: 'production',
		PUBLIC: 'https://edt-ecn.herokuapp.com',
		PORT: '3000'
	}),
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, '../src/index.html')
	}),
	new UglifyJsPlugin({
		uglifyOptions: {
            compress: {
                warnings: false,
                comparisons: false,
            },
            mangle: false,
            output: {
                comments: false,
                ascii_only: true,
            },
            sourceMap: true,
		}
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    })
	],
	resolve: {
		extensions: ['.js', '.jsx'],
	},
};
