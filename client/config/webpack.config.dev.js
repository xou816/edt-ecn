const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
    entry: path.resolve(__dirname, '../src/client.jsx'),
    devServer: {
        contentBase: path.resolve(__dirname, '../build/public'),
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
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            PUBLIC: 'http://localhost:3001',
            PORT: '3000'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};