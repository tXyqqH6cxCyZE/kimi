const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  //entry: {
  //  app: ["./main.js"],
  //},
  entry: {
    app: ["babel-polyfill", "./main.js"],
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
          plugins: [
            [
              "import",
              {
                libraryName: "antd",
                style: "css",
              },
            ],
          ],
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader"],
        }),
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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "less-loader"],
        }),
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 8888,
    open: true,
    hot: true,
    host: "localhost",
    disableHostCheck: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "./index.html",
      title: "金米云平台",
      favicon: path.resolve(__dirname, "src/statics/images/chongqinglogo.png"),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: "css/styles.css",
      allChunks: true,
    }),
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
  optimization: {
    usedExports: true,
  },
};