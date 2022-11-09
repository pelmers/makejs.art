const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CircularDependencyPlugin = require('circular-dependency-plugin');
const nodeExternals = require('webpack-node-externals');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

const shared = {
    context: ROOT,
    mode: process.env.BUILD_MODE || 'development',

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

    devtool: 'cheap-module-source-map',
    devServer: {},
}

const clientConfig = {
    ...shared,

    entry: {
        demo: './demo/index.tsx',
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
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
        }),
        new BundleAnalyzerPlugin(),
    ],
}


const serverConfig = {
    ...shared,
    entry: {
        index: './index.ts',
    },
    output: {
        filename: '[name].js',
        path: DESTINATION,
        libraryTarget: "commonjs2",
    },
    target: 'node',
    externals: [nodeExternals()]
}

module.exports = [clientConfig, serverConfig];
