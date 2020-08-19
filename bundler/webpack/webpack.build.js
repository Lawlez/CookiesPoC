const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const pack = webpackConfig => {
    return merge(common, {
        mode: 'production',
        devtool: 'source-map',
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
            minimize: true,
            minimizer: [new TerserPlugin({
                extractComments: true,
                cache: true,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                    extractComments: 'all',
                    // eslint-disable-next-line camelcase
                    compress: {
                        drop_console: true,
                        dead_code: true,
                        ecma: 2020,
                        unused: true,
                    },
                },
            })],
            usedExports: true,
        },
        output: {
            path: path.resolve(webpackConfig.PROJECT_PATH, 'dist/build'),
            filename: '[name].[hash].js',
        },
        entry: {
            bundle: [path.resolve(webpackConfig.PROJECT_PATH, 'src')],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CompressionPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 1024,
                minRatio: 0.8,
            }),
            new CompressionPlugin({
                filename: '[path].br[query]',
                algorithm: 'brotliCompress',
                compressionOptions: {
                    level: 11,
                },
                test: /\.(js|css|html|svg)$/,
                threshold: 512,
                minRatio: 0.9,
            }),
            new CopyWebpackPlugin({
                patterns: [{
                    from: path.resolve(webpackConfig.PROJECT_PATH, 'public/'),
                    to: path.resolve(webpackConfig.PROJECT_PATH, 'dist/build/'),
                    globOptions: {
                        ignore: ['config.js', 'template.html','bundle.js'],
                    }
                    ,
                }],
            }),
        ],
    })
}

module.exports = pack
