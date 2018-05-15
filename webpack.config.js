const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const internalIp = require('internal-ip')
const convert = require('koa-connect')

const dev = Boolean(process.env.WEBPACK_SERVE)
const config = require('./config/' + (process.env.npm_config_config || 'default'))
const pkgInfo = require('./package.json')



module.exports = {
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',


    entry: './src/index.js',

    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks: 'all'
        }
    },

    output: {
        path: resolve(__dirname, 'dist'),
        filename: dev ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',
        chunkFilename: 'js/[chunkhash].js',
        publicPath: config.publicPath
    },

    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        root: resolve(__dirname, 'src'),
                        attrs: ['img:src', 'link:href']
                    }
                }]
            },
            {
                test: /\.sc?ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },


            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                exclude: /favicon\.png$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            DEBUG: dev,
            VERSION: JSON.stringify(pkgInfo.version),
            CONFIG: JSON.stringify(config.runtimeConfig)
        }),
        new webpack.HashedModuleIdsPlugin(),

        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunksSortMode: 'none'
        })
    ],

    resolve: {
        alias: {
            '~': resolve(__dirname, 'src')
        },
        extensions: ['.js', '.css']
    }
}

if (dev) {
    module.exports.devServer = {
        host: '0.0.0.0',
        hot: {
            host: {
                client: internalIp.v4.sync(),
                server: '0.0.0.0'
            }
        },
        port: config.serve.port,
        dev: {
            publicPath: config.publicPath
        },
        // add: app => {
        //     app.use(convert(history({
        //       index: url.parse(config.publicPath).pathname,
        //       disableDotRule: true,
        //       htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
        //     })))
        //   }
    }
}