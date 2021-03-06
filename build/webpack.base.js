const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SimplePlugin = require('../plugins/simple-plugin')
const FileListPlugin = require('../plugins/file-list-plugin')

module.exports = {
  entry: {
    app: './src/script/index.js'
  },
  output: {
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../loaders')
    ]
  },
  optimization: {
    splitChunks: {
      // chunks: "async",
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack-study-demo',
      template: './src/index.html'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new SimplePlugin(),
    new FileListPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      },
      {
        test: /\.txt$/,
        use: [
          'trans-xml-to-html',
          {
            loader: 'read-txt',
            options: {
              value: 'yhw'
            }
          }
        ]
      }
    ]
  }
}