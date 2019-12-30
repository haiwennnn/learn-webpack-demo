const path = require('path')
const WebpackChain = require('webpack-chain')
const config = new WebpackChain()

const resolve = src => {
  return path.resolve(__dirname, src)
}

config
  .set('mode', "production")
  .entry('lesson01-index')
    .add(resolve('./index.js'))
    .end()
  .output
    .path(resolve('./distwc'))
    .filename('[name].bundle.js')
    .end()
  .optimization
    .minimize(false)
    .end()

module.exports = config.toConfig()


