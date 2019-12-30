const chalk = require('chalk')
const path = require('path')

const config = require('./base')()
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

const resolve = src => {
  return path.resolve(__dirname, src)
}

config.set('mode', 'development')

config.devServer
  .quiet(true)
  .https(false)
  .disableHostCheck(true)
  .clientLogLevel("none")
  .hot(true)
  .port(9000)
  .contentBase(resolve('./dist'))

const compiler = webpack(config.toConfig())

const chainDevServer = compiler.options.devServer
const server = new webpackDevServer(
  compiler,
  Object.assign(chainDevServer, {})
)

server.listen(9000)