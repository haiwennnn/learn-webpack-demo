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


## 模块热替换

