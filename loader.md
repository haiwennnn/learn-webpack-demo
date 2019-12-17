# 编写一个Loader

``loader``是导出为一个函数的node模块。
该函数在``loader``转换资源的时候调用。

### 简单的使用

当只有一个loader被使用来处理资源时，这个loader会接受一个参数，这个参数是包含资源文件内容的字符串。
简单数据返回可以直接``return data``，多返回值的情况下可以通过``this.callback(err, values...)``  
loader 会返回一个或者两个值。第一个值的类型是 JavaScript 代码的字符串或者 buffer。第二个参数值是 SourceMap，它是个 JavaScript 对象。

### 复杂的使用

当链式调用多个loader的时候，它们会按照从右到左从下到上的顺序执行调用

第一个loader接受资源文件内容字符串

中间的loader接受前一个被调用loader输出的内容

最后一个loader输出 ``JavaScript`` 和 ``source map``


### 引用方式

开发一个本地``loader``有几种引用方式：

直接访问loader目录下的文件
```
rules:[
  test: /\.txt$/,
  use: [
    {
      loader:path.resolve(__dirname, '../loader/read-txt/index.js'),
      options: {
        value: '123'
      }
    }
  ]
]
```

设置loader搜索目录

```
resolveLoader: {
  modules: [
    'node_modules',
    path.resolve(__dirname, '../loaders') // loader文件目录
  ]
},
rules:[
  {
    test:/\.txt$/,
    use:[
      {
        loader: 'read-txt',
        loader: 'read-txt/index.js',
        opetions:{
          value: 'yhw'
        }
      }
    ]
  }
]
```


### 写一个简单的loader

创建目录``loaders/read-txt``
创建文件``index.js``

```
// 读取options的方法
const getOptions = require('loader-utils').getOptions

// 导出一个模块转换数据的方法
module.exports = function (content) {
  const options = getOptions(this)
  
  // 输出各种匹配到的模块信息
  console.log('content:            ', content) // this is a txt [value]
  console.log('options:            ', options) // { value: 'yhw' }
  console.log('this.context:       ', this.context) // /Users/tongyuecheng/Documents/H5/learn-webpack-demo/src/assets
  console.log('this.request:       ', this.request) // /Users/tongyuecheng/Documents/H5..read-txt/index.js??ref--7-0!/Users/../src/assets/1.txt?abc=1
  console.log('this.resourcePath:  ', this.resourcePath) // /Users/tongyuecheng/Documents/H5/learn-webpack-demo/src/assets/1.txt
  console.log('this.resourceQuery: ', this.resourceQuery) // ?abc=1
  console.log('this.target:        ', this.target) // web
  console.log('this.resource:      ', this.resource) // /Users/tongyuecheng/Documents/H5/learn-webpack-demo/src/assets/1.txt?abc=1

  // 多个返回结果需要使用的回调方法
  var callback = this.callback

  // 异步结果需要使用async进行返回，会返回一个this.callback
  // var callback = this.async

  const json = JSON.stringify(content.replace(/\[value\]/, options.value))

  // 返回时需要返回一个模块不然会解析报错或者无法读取到数据
  callback(null, `export default ${json}`)
  // return `export default ${json}`
  // 使用callback返回数据时需要返回一个undefined
  return
}
```

### 写一个复杂的loader