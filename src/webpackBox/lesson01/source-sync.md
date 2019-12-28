# 同步源码解读

整体是一个自执行方法

```
(function(modules) {})([module1,module2])
```

### 主方法体内解析

```
(function(modules) {
  // 缓存被加载模块（缓存到内存中）
  var installedModules = {}
  // 加载模块的方法，webpack的require包装方法
  function __webpack_require__(moduleId) {}

  // 缓存被传入的modules
  __webpack_require__.m = modules
  // 保存已被加载的模块
  __webpack_require__.c = installedModules


})([module1,module2])


```

### 执行流程

```
// 从主方法提内最后一行，调用__webpack_require__引入代码模块moduleId=0的模块
return __webpack_require__((__webpack_require__.s = 0));

// 进入__webpack_require__方法
function __webpack_require__(moduleId) {}

// __webpack_require__方法内判断是否存在于缓存中，存在則直接導出
if (installedModules[moduleId]) {
  return installedModules[moduleId].exports;
}

// 不存在则创建一个新module
var module = (installedModules[moduleId] = {
  i: moduleId,
  l: false,
  exports: {}
})

// 执行module方法，__webpack_require__是一个同步获取模块的方法，方法一定存在于传入的modules中
// 步骤①
modules[moduleId].call(
  module.export,
  module,
  module.export,
  __webpack_require__
)

// 将模块是否加载进内存标记变为true
module.l = true

// 导出模块
return module.export

```

```
// 步骤 ① 解析
// moduleId=0的模块代码
function(module, exports, __webpack_require__) {
  const css = __webpack_require__(1)
  const a = 100;
  console.log(a, css);
}

// 源代码中第一行代码，引入了style.css文件，并指定编译loader
const css = require("css-loader!./style.css")

// 打包后的代码通过__webpack_require__引入响应模块
// 步骤 ②
// 变量css 等于 css-loader 导出的一个数组list
const css = __webpack_require__(1)

// 后面的代码是简单的js代码
const a = 100
console.log(a, css)

// 步骤 ② 中会跟步骤 ① 一样会对moduleId=1进行一次call方法调用
// moduleId=1代码
function(module, exports, __webpack_require__) {
  exports = module.exports = __webpack_require__(2)(false);
  exports.push([
    module.i,
    "body {\n  width: 100%;\n  height: 100vh;\n  background-color: orange;\n}",
    ""
  ]);
}

// 步骤 ② 解析
// 引入moduleId=2模块并执行，moduleId=2是css-loader
exports = module.exports = __webpack_require__(2)(false)

// 推入数据
// 待我去看看css-loader代码
exports.push({
  moduleId,
  被解析的代码,
  ""
})

// css-loader源码粗解
// css-loader会返回一个方法，
module.exports = function(useSourceMap) {
  var list = []
  // 修改toString方法，输出时会调用该方法
  list.toString = function toString() {}
  list.i = function(modules, mediaQuery) {}

  return list
  // 解析list内的数据，此次调用返回的是exports.push进去数组的第二项 body {\n  width: 1...r: orange;\n}
  function cssWithMappingToString(item, useSourceMap) {}
  function toComment(sourceMap) {}
}
// 方法调用后会返回一个数组，该数组的toString方法被修改
list.toString = function toString() {
  return this.map(function(item) {
    var content = cssWithMappingToString(item, useSourceMap);

    if (item[2]) {
      return "@media ".concat(item[2], "{").concat(content, "}");
    }
    return content;
  }).join("");
}
// 打包后的css-loader模块代码使用__webpack_require__引入会得到一个方法 function(useSourceMap) {}
// 调用该方法会得到一个数组 list
exports = module.exports = __webpack_require__(2)(false)
// 讲css内容推入数组中
exports.push([
  module.i,
  "body {\n  width: 100%;\n  height: 100vh;\n  background-color: orange;\n}",
  ""
])

```
