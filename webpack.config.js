const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/Game.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'ts-loader'
            },
            {
                test: require.resolve('phaser'),
                loader: 'expose-loader',
                options: {exposes: {globalName: 'Phaser', override: true}}
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ gameName: 'My Phaser Game', template: 'src/index.html' }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
            ]
        })
    ],
    devServer: {
        static: path.resolve(__dirname, './'),
        host: 'localhost',
        port: 8080,
        open: false
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}