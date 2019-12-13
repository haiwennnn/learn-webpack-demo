const merge = require('webpack-merge')
const webpackBase = require('./webpack.base.js')
const webpack = require('webpack')

module.exports = merge(webpackBase, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})