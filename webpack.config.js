const path = require('path');
const isProduction = (process.env.NODE_ENV === 'production');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
    entry: ["@babel/polyfill", path.resolve(__dirname, './src/main.js')],
    output: {
        filename: 'main.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        port: 3000,
        hot: true,
        contentBase: 'dist',
    },
    resolve: {
        alias: {
            'react': 'react',
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['*', '.js', '.json', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    !isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /(\.js|\.jsx)$/i,
                use : [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                ],
                exclude: '/node_modules/'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
        }),
        new MiniCssExtractPlugin({
            minimize: isProduction,
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
            ignoreOrder: false
        }),
        new CleanWebpackPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    extractCommands: 'all',
                    compress: {
                        warnings: false,
                        drop_console: false,
                        drop_debugger: true,
                    }
                }
            })
        ]
    },
};