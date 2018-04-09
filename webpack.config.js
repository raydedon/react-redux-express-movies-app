const Webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pathsToClean = ['public', 'views'];
const cleanOptions = {
    root:     path.resolve(__dirname),
    verbose:  true,
    dry:      false
};


const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const devSCSS = ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'];
const prodSCSS = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    //resolve-url-loader may be chained before sass-loader if necessary
    use: ['css-loader', 'postcss-loader', 'sass-loader']
});
const isProd = (process.env.NODE_ENV || 'dev') === 'prod';
const scssConfig = isProd ? prodSCSS : devSCSS;
const devCSS = ['style-loader', 'css-loader', 'postcss-loader'];
const prodCSS = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    //resolve-url-loader may be chained before sass-loader if necessary
    use: ['css-loader', 'postcss-loader']
});
const cssConfig = isProd ? prodCSS : devCSS;
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
    context: path.resolve(__dirname, 'public'),
    devtool: 'cheap-module-eval-source-map',
    entry: {
        main: '../src/app2/main.js',
        bootstrap: bootstrapConfig
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: "/",
        filename: '[chunkhash].[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: cssConfig
            },
            {
                test: /\.scss$/,
                use: scssConfig
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|woff2?|svg)$/,
                use: [{
                    loader: 'url-loader'
                }]
            },
            {
                test: /\.html$/,
                use: 'html-loader',
                exclude: [
                    /(node_modules|public)/
                ]
            },
            {
                test: /bootstrap-sass\/assets\/javascripts\//,
                use: 'imports-loader?jQuery=jquery'
            }
        ]
    },
    performance: {
        hints: "error"
    },
    plugins: [
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new ExtractTextPlugin({
            filename: '[name].css',
            disable: !isProd,
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: 'Judo Heroes - A Universal JavaScript demo application with React',
            template: '../src/views/index.ejs',
            hash: true,
            cache: true,
            favicon: '../src/images/favicon.ico',
            filename: '../views/index.ejs'
        }),
        new Webpack.ProvidePlugin({
            jQuery: 'jquery'
        })
    ]
};