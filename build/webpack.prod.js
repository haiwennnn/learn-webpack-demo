const webpack = require('webpack')
const webpackBase = require('./webpack.base.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpackMerge = require('webpack-merge')

module.exports = webpackMerge(webpackBase, {
  devtool: 'source-map',
  plugins: [
    // new UglifyJSPlugin({
    //   sourceMap: true
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
})