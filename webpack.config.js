const webpack = require('webpack');
const path = require('path');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
    context: ROOT,

    mode: process.env.BUILD_MODE || 'development',
    entry: {
        demo: './demo/index.tsx',
        index: './index.ts',
    },

    output: {
        filename: '[name].bundle.js',
        path: DESTINATION,
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [ROOT, 'node_modules'],
    },

    module: {
        rules: [
            /****************
             * PRE-LOADERS
             *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader',
            },
            /****************
             * LOADERS
             *****************/
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                use: 'ts-loader',
            },
        ],
    },
    // https://stackoverflow.com/a/64553486
    plugins: [
        // fix "process is not defined" error:
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        // fix "Buffer not defined" error:
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],

    devtool: 'inline-cheap-module-source-map',
    devServer: {},
};
