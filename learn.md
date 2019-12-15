# Webpack

## 基本安装

```
npm init -y #默认初始化npm
npm install webpack webpack-cli --save-dev # 安装webpack
```

## 简单调用方式

```
# 直接编译某个文件

npx webpack file #默认输出到dist文件夹内，文件名mian

# 创建配置文件
webpack.config.js

const path = require('path')

module.exports = {
    entry: './src/script/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}

# 如果增加了webpack.config.js,webpack默认会使用该配置文件
npx webpack --config webpack.config.js

```

## 拓展知识：npx

npmx是npm上的一个包，它可以让模块调用更方便和简单

npx调用的时候会去``node_modules/.bin``路径和环境变量``$PATH``,检查命令是否存在

npm版本 >= 5.2.0，会自动安装npx

``npx <command>`` npx会做什么

    1. 在本地找，找到了就使用
    2. 没找到，会直接下载最新版本

## 管理资源

#### 加载CSS

```
#需要依赖两个模块
npm install --save-dev style-loader css-loader

#配置文件中需要增加对loader的引用

module.exports = {
    ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}

# css-loader是把css的解析成js模块
# style-loader把解析好的js模块插入到html header标签内

```

#### 加载图片

解析图片需要使用``file-loader``模块,会将图片资源赋值到相应的输出文件夹下

```
module.exports = {
    ...
    module: {
        rules: [
            ...
            {
                test: /\.(png|jpg|gif|jpeg|svg)$/,
                use:[
                    'file-loader'
                ]
            }
        ]
    }
}

```

或者使用``url-loader``模块对相关资源进行解析，该模块可以让比较小的图片变成DataURL

```
{
    test: /\.(png|jpg|gif|jpeg|svg)$/,
    use:[
        {
            loader: 'url-loader',
            options: {
                limit: 10000
            }
        }
    ]
}

```

#### 加载字体

加载字体与加载图片类似，需要借助``file-loader``或者是``url-loader``进行文件的拷贝或者DataURL的转换

#### 加载数据

除了一些资源之外，代码中还会出现很多数据格式，JSON是内置支持的，CSV，TSV，和XML需要额外的loader去支持

```
# 安装处理的包
npm install csv-loader xml-loader --save-dev

# 同样需要增加rule配置项

```


## 管理输出

#### 自动生成index.html文件

需要用到``html-webpack-plugin``这个插件

```
# 增加配置项

const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    ...
    plugins: [
        new htmlWebpackPlugin({
            title: 'webpack-study-demo', # 可以在页面中被拿到 <%= htmlWebpackPlugin.options.title %>
            template: './src/index.html' # 指定一个模板
        })
    ]
}

```

webpack会按照``./src/index.html``为模板生成目标html，并且会将打包生成的js文件插入``</body>``标签之前引入

```
<script type="text/javascript" src="app.bundle.js"></script><script type="text/javascript" src="print.bundle.js"></script></body>
```

#### 清理dist文件夹

```
npm install --save-dev clean-webpack-plugin
```




## 开发设置

建立一个开发环境

#### 使用source-map

使用webpack打包的代码报错后很难被追踪
``devtool``相关参数需认真阅读[devtool](https://www.webpackjs.com/configuration/devtool/)

```
# 增加设置

moudle.exports = {
    entry: { ... },
    devtool: 'inline-source-map'
}

# 页面内报错会被正确的定位到文件和行数，例如 print.js:2

```

#### 增加文件监听和自动刷新

``webpack-dev-server``模块提供了一个建议服务器，并且能够监听到文件的修改，自动刷新浏页面

[参考链接](https://www.jianshu.com/p/9a410c71ed74)，[解读](https://www.jianshu.com/p/1a7653ced053)

[webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/) 参考链接

```
# webpack.config.js增加配置文件

module.exports = {
    devtool: ...,
    devServer: {
        contentBase: './dist',
        port: 9000
    },
    ...
}

# 以上配置告诉 ``webpack-dev-server``,在``location:9000``下建立服务，将``dist``目录下的文件作为可访问文件

# package.json

scripts: {
    ...
    "start": "webpack-dev-server --open",
    ...
}

```

``webpack-dev-middleware``是一个容器，它可以把webpack处理后的文件传递给一个服务器（server），``webpack-dev-server``在内部使用了该模块，同时它也可以作为一个单独的包来使用

特点：

1. 打包后的文件直接写入内存
2. 每次请求都会得到最新的打包结果
3. 在监视模式下如果代码变化，middleware会马上停止旧版的bundle，并且会挂起请求直到打包完成才响应

```
# 创建server.js文件用来调用express启动服务

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

# webpack.config.js 设置publicPath

output.publicPath = '/'

```

通过``node server``跑起服务后，修改文件会自动重新打包


## 模块热替换 (Hot Module Replacement HMR)

#### 如何启用HMR

如果使用了``webpack-dev-server``需要更新配置文件

```
const webpack = require('webpack')
devServer: {
    hot: true
}
plugins: [
    ...
    new webpack.NamedModulesPlugin(), # 用来增加输出信息
    new webpack.HotModuleReplacementPlugin()# 用来增加输出信息
    ...
]

```

在代码内部能够通过``module.hot.accept``拿到更新的模块

```
if(module.hot){
    module.hot.accept('./print.js', function() {
        printMe()
    })
}
```

[HMR运行原理](https://www.webpackjs.com/concepts/hot-module-replacement/)，[HMR-API](https://www.webpackjs.com/api/hot-module-replacement/)


## Tree Shaking

``Tree Shaking``是一个术语，用来描述移除JavaScript上下文中的未引用代码（dead-code）。它依赖于ES2015模块系统中的静态结构特性，例如``import``,``export``

``什么是静态结构特性`` ES2015之前的JavaScript模块化是支持动态加载的，载入的模块会在运行时动态变化，静态结构会在引入编译时确定导入和导出的内容不允许在运行时发生变化。

为了使用``Tree Shaking``必须干点事情：
1. 使用ES2015模块语法
2. 在项目``package.json``中添加一个``sideEffects``入口
3. 引用一个能删除未引用代码（dead code）的工具（例如：``UglifyJSPlugin``）


## 生产环境构建

分离webpack配置，划分出生产配置文件和开发配置文件

开发配置文件注重错误查询，实时重载，模块热加载等

生产配置文件关注更小的bundle，更轻量的source map，更优化的资源

```
# 创建创建build/webpack.base.js文件

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/script/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack-study-demo',
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|svg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  }
}
```
```
# 创建build/webpack.dev.js文件

const merge = require('webpack-merge')
const webpackBase = require('./webpack.base.js')
const webpack = require('webpack')

module.exports = merge(webpackBase, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})
```
```
# 创建build/webpack.prod.js

const webpack = require('webpack')
const webpackBase = require('./webpack.base.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpackMerge = require('webpack-merge')

module.exports = webpackMerge(webpackBase, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
})
```

设置npm scripts 指令
```
"scripts": {
  "start": "webpack-dev-server --open --config build/webpack.dev.js",
  "build": "webpack --config build/webpack.prod.js"
}
```


## 代码分离

代码分离是webpack最引人注目的特性之一，代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

三种常用的分离方式

1. 入口起点：使用``entry``手动分离代码
2. 防止重复：使用``CommonsChunkPlugin``去重和分离chunk
3. 动态导入：通过模块的内连函数调用来分离代码

#### 防止重复配置

> webpack4 中已经删除了``CommonChunkPlugin``的引用

```
# 通过CommonsChunkPlugin插件进行代码去重
new webpack.optimize.CommonsChunkPlugin({
  name: 'common' // 指定公共 bundle 的名称。
})
```

相关去重插件 [css去重ExtractTextWebpackPlugin](https://www.webpackjs.com/plugins/extract-text-webpack-plugin/)

#### 动态导入

动态导入有两种方式

1. ECMAScript提案中的``import()``方法
2. webpack特定的``require.ensure()``

``import()``方式

```
async function getLodash(){
  var _ = await import( /* webpackChunkName: "lodash" */ 'lodash')
  return _
}
getLodash().then(_ => {
  _.xxxxx
})
```

```动态导入的懒加载实践```

```
# 将print之前的引入删除，增加一个按钮，在按钮事件触发的时候进行print引入
btn.onclick = function () {
  import( /* webpackChunkName: "print" */ './print').then(module => {
      var print = module.default
      print()
  })
}
```

按钮点击之后会异步加载print模块


## 缓存

使用webpack来打包我们的模块化后的程序，webpack会生成一个可部署的dist目录下的内容，只需要把dist下的内容部署到服务器上，客户端就能够访问相关资源。

浏览器访问资源的时候会使用缓存技术决定是否使用上次缓存下来的资源进行响应，如果我们在部署新版本的时候不更改资源名称，浏览器可能会认为它没有被更新，可能会造成没有使用服务器上最新的代码

#### 给输出的文件命名

```
# 修改output.filename
output:{
  filename: [name].[chunkhash].bundle.js
}

```

打包后生成的代码会带上一个hash值``app.b075aefef677991fd2df.bundle.js``

> webpack4中已经移除了``CommonChunkPlugin``，要进行代码分割可以使用``SplitChunksPlugin``

```
# 增加打包配置信息
output:{ ... },
optimization: {
  splitChunks: {
    chunks: "async",
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        chunks: "all"
      }
    }
  }
},
plugins:[ ... ]
```

配置之后可以提取出``node_modules``目录下的模块合并到``vendors.chunkhash.js``文件内，也能打出异步引用的``print.chunkhash.js``

**面临的问题：**

公共模块未更改，当增加或者减少模块时会造成未改变的静态模块文件名被更改

**解决方案：**

使用``HashedModuleIdsPlugin``

```
plugins: [
  ...
  new webpack.HashedModuleIdsPlugin()
  ...
]
```

> 实践证明好像无效，进行模块增减的操作无法保证chunkhash不变，还需再研究研究


## 创建Lib


## Shimming

``webapck``能够识别遵循ES2015模块语法、CommonJS或AMD规范编写的模块，一些第三方库不合理的引用一些全局依赖使Shimming有了发挥的空间

#### Shimming全局变量

通过``ProvidePlugin``提供一个变量能让全局通过这个变量访问到package

```
# 暴露整个库
plugins: [
    new webpack.ProvidePlugin({
        _: 'lodash'
    })
]

# 暴露模块中的单个值
plugins: [
    new webpack.ProvidePlugin({
        map: ['lodash'.'map']
    })
]
```

#### 细粒度的Shimming

通过``imports-loader``库可以改变目标模块的前置引用、初始变量、上下文环境

[参考链接](https://www.webpackjs.com/loaders/imports-loader/)

还有导出``exports-loader``

[参考链接](https://www.webpackjs.com/loaders/exports-loader/)

#### 加载一些垫子库


## 渐进式网络应用程序（PWA）

后续学习（TODO）

## TypeScript

后续学习（TODO）

## 迁移到新版本

后续学习（TODO）

## 使用环境变量