const path = require('path')

const resolve = src => {
  return path.resolve(__dirname, src)
}

module.exports = [
  resolve('./base.js'),
  resolve('./css.js'),
  resolve('./htmlWebpackPlugin.js')
]