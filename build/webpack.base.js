const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/script/index.js'
  },
  output: {
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].bundle.js',
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
      chunks: "async",
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
    new webpack.HashedModuleIdsPlugin()
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
          'trans-xml-to-html',
          'xml-loader'
        ]
      },
      {
        test: /\.txt$/,
        use: [
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