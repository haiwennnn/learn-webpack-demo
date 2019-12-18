# 学习写一个插件

### 什么是插件

插件的目的在于解决``loader``无法解决的事情（啥事啊？）

插件主要作用与webpack打包的各个阶段上，例如：打包开始、打包结束等生命周期。

将自己的一些操作引入到webpack构建流程中

### 简单的插件长啥样

```
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

```


### 一个异步插件，webpack上的示例

```
function FileListPlugin() { }

FileListPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    var fileList = 'in this build \n\n'
    for (var filename in compilation.assets) {
      fileList += ('- ' + filename + '\n');
    }
    // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
    compilation.assets['fileList.md'] = {
      source: function () {
        return fileList
      },
      size: function () {
        return fileList.length
      }
    }
    callback()
  })
}

module.exports = FileListPlugin
```

最终会在dist目录下生成一个fileList.md文件

```
in this build 

- c923dfe395050175f54d6b4777837781.jpg
- app.1055510db9b51366e05b.bundle.js
- print.81747b033963f0491c65.bundle.js
- vendors.0bca62990592f45685ba.bundle.js
- app.1055510db9b51366e05b.bundle.js.map
- print.81747b033963f0491c65.bundle.js.map
- vendors.0bca62990592f45685ba.bundle.js.map
- index.html

```