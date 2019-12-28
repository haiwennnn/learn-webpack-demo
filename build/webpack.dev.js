const merge = require('webpack-merge')
const webpackBase = require('./webpack.base.js')
const webpack = require('webpack')
const path = require('path')

module.exports = merge(webpackBase, {
  // devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 9000,
    // hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})