# webpack

### webpack是啥东西？

webpack是一个模块打包机，它会分析你的项目对项目内的资源进行处理打包成合适的格式供浏览器使用。

### webpack与gulp/grunt有什么区别

``相同点：``
都能满足前端自动化构建工具的任务，都能够将代码文件转换成可使用的文件

``不同点``
gulp不包含模块化概念，若想使用需要额外增加模块来支持
webpack实现了模块化开发概念，能够构建一个依赖关系图，所有的资源最终都会被打包成一个个模块

### webpack的一些概念

- ``Entry`` ：入口，webpack构建的入口
- ``Module``：模块，webpack里面一切介模块，从Entry入口递归的找出依赖的模块
- ``Chunk`` ：代码块，找出依赖模块经转换后组合成代码块
- ``Loader``：模块转换器，将模块内容转换成新内容可能是模块
- ``Plugin``：拓展插件，webpack构建过程中，会在特定的时机广播对应的事件，插件一般会在特定的实际下绑定事件触发想要执行的操作


### webpack构建详细流程

1. ``初始化``：从配置文件或Shell读取合并出最终的构建配置，并实例化插件new Plugin()
2. ``开始编译``：通过上一步得到一个最终的构建配置，初始化一个``Complier``对象，加载插件（依次调用插件中的apply方法），通过执行Complier.run方法开始编译
3. 
