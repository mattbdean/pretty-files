const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    context: path.resolve(__dirname, '..'),
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
                            // scss: <bla>
                        }
                    },
                }
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.node.NODE_ENV': '"testing"'
        }),
        new HtmlWebpackPlugin({
            template: 'app/index.html',
            cache: true
        })
    ],
    target: 'electron-main'
};
