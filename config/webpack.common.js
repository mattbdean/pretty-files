const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, '..'),
    entry: {
        app: './app/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // Leave publicPath empty so that we don't have to rely on absolute paths
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.vue']
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
        new HtmlWebpackPlugin({
            template: 'app/index.html',
            cache: true
        }),
    ],
    target: 'electron-renderer'
};
