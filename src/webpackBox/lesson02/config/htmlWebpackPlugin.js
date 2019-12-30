const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (config, resolve) => {
  return () => {
    config.plugin('html')
      .use(HtmlWebpackPlugin, [
        {
          template:resolve('../public/index.html')
        }
      ])
  }
}