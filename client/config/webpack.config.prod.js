const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/client.jsx'),
    output: {
        filename: 'bundle.[chunkhash:8].js',
        path: path.resolve(__dirname, '../build/public'),
        publicPath: '/public/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, '../src'),
                exclude: /(node_modules|service-worker\.js)/,
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
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
        }),
        new WorkboxPlugin.InjectManifest({
            swSrc: path.resolve(__dirname, '../src/service-worker.js')
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    optimization: {
        minimizer: [new TerserPlugin()],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};
