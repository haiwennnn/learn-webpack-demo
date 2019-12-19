// 创建一个插件构造方法
function SimplePlugin() {
  console.log('create SimplePlugin instace')
}

// 给构造方法原型上添加apply方法，apply方法会被webpack compiler调用一次并且会传入complier对象
SimplePlugin.prototype.apply = function (compiler) {
  // 指定一个挂载到 webpack 自身的事件钩子
  compiler.plugin('done', function () {
    console.log('call done')
  })
}

module.exports = SimplePlugin
