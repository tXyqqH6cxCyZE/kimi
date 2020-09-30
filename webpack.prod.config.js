const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: false,
  entry: {
    //  app: "./main.js",
    app: ["babel-polyfill", "./main.js"],
    vendor: ["react"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name][hash:8].bundle.js",
    chunkFilename: "js/[name][hash:8].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: require.resolve("babel-loader"),
        exclude: /node_modules/,
        options: {
          plugins: [["import", { libraryName: "antd", style: "css" }]],
          compact: true,
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 50, //小于50字节打包成base64
          name: "[hash:8].[name].[ext]",
          outputPath: "images",
        },
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  optimization: {
    concatenateModules: true,
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        "react-vendor": {
          test: (module) =>
            /react/.test(module.context) ||
            /redux/.test(module.context) ||
            /classnames/.test(module.context) ||
            /prop-types/.test(module.context),
          priority: 3,
          reuseExistingChunk: false,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "./index.html",
      title: "粮票平台",
      favicon: path.resolve(__dirname, "src/statics/images/chongqinglogo.png"),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new CleanWebpackPlugin(["dist"]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      statics: path.resolve(__dirname, "src/statics"),
      pages: path.resolve(__dirname, "src/pages"),
      component: path.resolve(__dirname, "src/component"),
      store: path.resolve(__dirname, "src/store"),
      utils: path.resolve(__dirname, "src/utils"),
      config: path.resolve(__dirname, "src/config"),
      server: path.resolve(__dirname, "src/server"),
    },
    extensions: [".js"],
  },
};
