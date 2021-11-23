/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const dotenv = require('dotenv')

const dockerFallbackEnv = {
    API_ENDPOINT: process.env.API_ENDPOINT,
    CHOKIDAR_USEPOLLING: process.env.CHOKIDAR_USEPOLLING
}

const envConfig = dotenv.config({ path: resolve(__dirname, '..', '.env') }).parsed || dockerFallbackEnv

const isDev = process.env.NODE_ENV !== 'production'

const envKeys = Object.keys(envConfig).reduce((acc, iter) => {
    return { ...acc, [iter]: JSON.stringify(envConfig[iter]) }
}, {})

function getCustomWebpackConfig() {
    const config = {
        mode: isDev ? 'development' : 'production',
        devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
        entry: ['webpack/hot/dev-server', './src/index.tsx'],
        output: {
            path: resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            publicPath: isDev ? 'http://localhost:3000/' : '/'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
        },
        watchOptions: {
            aggregateTimeout: 500, // delay before reloading
            poll: 1000 // enable polling since fsevents are not supported in docker
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                favicon: './src/assets/favicon.png',
                inject: 'body'
            }),
            new webpack.DefinePlugin({
                process: envKeys
            })
        ]
    }

    if (!isDev) {
        config.optimization = {
            minimizer: [new TerserWebpackPlugin()]
        }
    } else {
        config.devServer = {
            port: 3000,
            open: true,
            historyApiFallback: true
        }
    }

    return config
}

module.exports = getCustomWebpackConfig
