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
            title: 'webpack-study-demo', # 可以在页面中被拿到
            template: './src/index.html' # 指定一个模板
        })
    ]
}

```

webpack会按照``./src/index.html``为模板生成目标html，并且会将打包生成的文件插入``</body>``标签之前

#### 清理dist文件夹

```
npm install --save-dev clean-webpack-plugin
```