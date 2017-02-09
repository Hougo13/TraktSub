let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        background: './src/background.js',
        inject: './src/inject.js',
        popup: './src/popup.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './logo', to: './logo'},
            {from: './icons', to: './icons'},
            {from: './popup.html'},
            {from: './manifest.json'}
        ])
    ],
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};