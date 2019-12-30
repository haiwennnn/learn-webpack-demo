const path = require('path')
const files = require('../config')
const WebpackChain = require('webpack-chain')
const config = new WebpackChain()

console.log('files: ', files)

const resolve = src => {
  return path.resolve(__dirname, src)
}

config
  .entry('index')
    .add(resolve('../src/index.js'))
    .end()
  .output
    .path(resolve('../dist'))
    .filename('[name].bundle.js')
    .end()
  
config
  .module
    .rule('css')
      .test(/\.css$/)
      .use('css')
        .loader('css-loader')

module.exports = () => {
  let map = new Map()
  files.forEach(file => {
    let name = file.split('/').pop().replace('.js', '')
    return map.set(name, require(file)(config, resolve))
  })
  console.log(map)
  map.forEach(v => v&&v())

  return config
}
