/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const dotenv = require('dotenv')

const isDev = process.env.NODE_ENV !== 'production'

function getCustomWebpackConfig() {
    const env = dotenv.config().parsed

    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next])
        return prev
    }, {})

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
                inject: 'body'
            }),
            new webpack.DefinePlugin(envKeys)
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
