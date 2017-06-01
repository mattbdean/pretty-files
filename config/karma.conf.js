const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const commonConfig = require('./webpack.common');

let webpackConfig = merge(commonConfig, {
    devtool: '#inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"testing"'
        })
    ]
});

// Get rid of this extra stuff
delete webpackConfig.entry;
delete webpackConfig.output;

module.exports = config => {
    config.set({
        browsers: ['VisibleElectron'],

        // For whatever reason Electron needs to be run in a non-iframe to have
        // access to node utilities like require()
        client: {
            useIframe: false
        },

        // By default karma-electron doesn't show us the goods
        customLaunchers: {
            VisibleElectron: {
                base: 'Electron',
                flags: ['--show']
            }
        },

        // Include this one file so that we can use webpack to require all our
        // sources and tests
        files: ['./karma-test-shim.js'],
        frameworks: ['mocha'],

        //
        preprocessors: {
            './karma-test-shim.js': ['webpack', 'sourcemap']
        },

        // Use an actually good reporter
        reporters: ['mocha-clean'],

        // Make Karma not annoying
        singleRun: true,

        // Webpack configuration
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    })
};
