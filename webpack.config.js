const path = require('path');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
    context: ROOT,

    mode: process.env.BUILD_MODE || 'development',
    entry: {
        demo: './demo/index.tsx',
    },

    output: {
        filename: '[name].bundle.js',
        path: DESTINATION,
    },

    resolve: {
        extensions: ['.ts', '.js'],
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

    devtool: 'inline-cheap-module-source-map',
    devServer: {},
};
