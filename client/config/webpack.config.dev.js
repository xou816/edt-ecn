const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '../src/client.jsx'),
    devServer: {
        contentBase: path.resolve(__dirname, '../build'),
        watchContentBase: true,
        historyApiFallback: true
    },
    output: {
        filename: 'compiled.js',
        path: path.resolve(__dirname, '../build/public'),
        publicPath: '/'
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
            NODE_ENV: 'development',
            PUBLIC: 'http://localhost:3001',
            PORT: '3000'
        }),
        new CopyWebpackPlugin([{
            from: 'public/**/*',
            to: path.resolve(__dirname, '../build/public', '[path]', '..', '[name].[ext]'),
            toType: 'template'
        }]),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};