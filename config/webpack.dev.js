const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: {
        app: './app/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        // Leave publicPath empty so that we don't have to rely on absolute paths
        publicPath: ''
    },
    resolve: {
        // .json is required for importing chai
        extensions: ['.js', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, 'app')],
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        esModule: true,
                        loaders: {
                            scss: 'vue-style-loader!css-loader!sass-loader'
                        }
                    },
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.svg$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: 'app/index.html',
            cache: true
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        port: 3000
    },
    target: 'electron-main'
};
