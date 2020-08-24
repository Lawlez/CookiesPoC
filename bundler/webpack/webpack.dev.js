const merge = require("webpack-merge");
const webpack = require("webpack");
const WriteFilePlugin = require("write-file-webpack-plugin");
const fs = require("fs");
const path = require("path");
const common = require("./webpack.common.js");

const pack = (webpackConfig) => {
  return merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      contentBase: path.resolve(webpackConfig.PROJECT_PATH, "public"),
      disableHostCheck: true,
      historyApiFallback: true,
      https: {
        key: fs.readFileSync(webpackConfig.CERT_PATH_KEY),
        cert: fs.readFileSync(webpackConfig.CERT_PATH_CRT),
      },
      public: webpackConfig.HOST,
      host: "192.168.100.155",
      port: webpackConfig.PORT,
      publicPath: "/",
    },
    output: {
      path: path.resolve(webpackConfig.PROJECT_PATH, "public"),
      filename: "[name].js",
    },
    entry: {
      bundle: [path.resolve(webpackConfig.PROJECT_PATH, "src")],
    },
    optimization: {
      runtimeChunk: "single",
      usedExports: true,
    },
    plugins: [
      new WriteFilePlugin({
        test: /^(?!.*(hot)).*/,
      }),
      new webpack.HotModuleReplacementPlugin({
        stats: "errors-only",
      }),
    ],
  });
};

module.exports = pack;
