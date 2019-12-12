const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')
const complier = webpack(config)

app.use(webpackDevMiddleware(complier, {
  publicPath: config.output.publicPath
}))

app.listen('3000', function() {
  console.log(' express listen in 3000')
})