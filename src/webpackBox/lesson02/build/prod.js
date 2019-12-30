const ora = require('ora')
const chalk = require('chalk')
const path = require('path')

const config = require('./base')()
const webpack = require('webpack')

config
  .set('mode', 'production')
  .optimization
    .minimize(false)
    .end()

const spinner = ora('开始构建...')

spinner.start()
// console.log('config:',config)
webpack(config.toConfig(), function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(
    stats.toString({
      color: true,
      modules: false,
      children: false,
      chunk: false,
      chunkModules: false
    }) + '\n\n'
  )
  if (stats.hasErrors()) {
    console.log(chalk.red('构建失败!\n'))
    process.exit(1)
  }

  console.log(chalk.cyan('build完成\n'))
})