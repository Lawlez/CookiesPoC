
const webpack = require('webpack')

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: ['babel-loader'],
            },
            {
                test: /\.html$/,
                exclude: /template\.html$/,
                use: [{
                    loader: 'html-loader',
                }],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.woff(2)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: './font/[hash].[ext]',
                        mimetype: 'application/font-woff',
                    },
                }],
            }
        ],
    },
    resolve: {
        mainFields: [
            'browser',
            'main',
            'module',
        ],
        extensions: [
            '.js',
            '.json',
            '.jsx',
        ],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        //limits the maximum number of chunks to produce; default: 1
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 10,
        })],
}
