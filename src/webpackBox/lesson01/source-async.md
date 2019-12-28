# 异步代码解读

### 代码文件与结构

产生异步引用会多打包出其他代码文件

bundle.js
1.bundle.js

```
// 模块整体结构与同步引用模块类似，增加了异步请求模块的方法
(function(modules) {
  // 缓存被加载模块（缓存到内存中）
  var installedModules = {}

  // 已被加载进来的代码块key表示索引 v=0表示已经加载
  var installedChunks = {
    0: 0
  };

  // 返回jsonpScript脚本引用路径的方法
  function jsonpScriptSrc(chunkId)

  // 新增了一个webpackJsonCallback回调方法 method ③
  function webpackJsonpCallback(data)

  // 同步加载模块的方法，webpack的require包装方法
  function __webpack_require__(moduleId) {}

  // webpack异步引用模块方法 method ①
  __webpack_require__.e = function requireEnsure(chunkId)

  // 缓存被传入的modules
  __webpack_require__.m = modules
  // 保存已被加载的模块
  __webpack_require__.c = installedModules

  // define getter function for harmony exports method ②
  __webpack_require__.d = function(exports, name, getter)

  // 对ES6或ES5环境设置不同的标记值
  __webpack_require__.r = function(exports)

  // create a fake namespace object method ⑤
  __webpack_require__.t = function(value, mode)

  // 获取 defaultExport function 的兼容方法
  __webpack_require__.n = function(module)

  // 读取所有在window.webpackJsonp对象内存在的chunk代码包

  // 初始化window.webpackJsonp
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);

  // 使用bind方法拷贝保存一份push方法
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);

  // 将push方法指向新的方法，webpack打包的异步模块载入成功会直接调用该方法
  jsonpArray.push = webpackJsonpCallback;
  // 深拷贝一份jsonpArray数组内容
  jsonpArray = jsonpArray.slice();
  // 循环将jsonpArray数组内模块通过webpackJsonpCallback添加到modules中
  for (var i = 0; i < jsonpArray.length; i++)
    webpackJsonpCallback(jsonpArray[i]);

  var parentJsonpFunction = oldJsonpFunction

  // 引入同步模块1
  return __webpack_require__((__webpack_require__.s = 1))

})([module1,module2])

```

从引入模块 1 开始，webpack_require 在同步代码中已经讲过会调用该 modole

```
function(module, exports, __webpack_require__) {

  // css同步引入同步模块2
  const css = __webpack_require__(2);
  // css02引入异步模块1
  // 根据模块 ①的解读会返回一个Promise.all(promises)
  // promises内的promise会在script加载完chunk文件后立刻执行window["webpackJsonp"].push方法（method ③），该方法已在主流程中替换成了webpackJsonpCallback方法
  // method ③ 执行完毕后会调用每个加载的chunk所创建的promise的resolve方法
  // __webpack_require__.t.bind(null, 3, 7) method ⑤
  const css02 = __webpack_require__.e(/* import() */ 1).then(__webpack_require__.t.bind(null, 3, 7));
  const a = 100;
  console.log(a, css);
  // css02的值可以这么取出来
  // Module {default: Array(1), __esModule: true, Symbol(Symbol.toStringTag): "Module"}
  css02.then(data => console.log('css02', data))

  // 自此异步引用也完成了
  // 同步与异步的不同在于得到的代码  异步是放置在default属性中  同步代码本身就是个数组 （css-loader）
}
```

解读 method ①
`__webpack_require__.e = function requireEnsure(chunkId)`

```
// 入参 1
chunkId = 1
var promises = [];

// 从installedChunks中读取模块加载的状态，如果是0直接返回相应的所有的promise
var installedChunkData = installedChunks[chunkId]
if( installedChunkData === 0 ) return promises

// 未加载的情况 installedChunkData !== 0
// 首次进来installedChunkData=undefined，进行else逻辑
if (installedChunkData) {
  promises.push(installedChunkData[2]);
} else {
  // 创建一个promise，将 [resolve, reject] 赋值给 installedChunkData = installedChunks[chunkId] = [resolve, reject]
  // 模块首次加载时创建一个promise，在已加载chunk对象中将resolve，reject放进数组中方便后面调用
  var promise = new Promise(function(resolve, reject) {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  })

  // 将当前创建的promise推入installedChunks[chunkId]第三项，并推入promises后续会返回这个promises
  promises.push((installedChunkData[2] = promise))

  // 创建script标签，引入对应的chunk文件
  var script = document.createElement("script");
  var onScriptComplete;
  script.charset = "utf-8";
  script.timeout = 120;
  if (__webpack_require__.nc) {
    script.setAttribute("nonce", __webpack_require__.nc);
  }
  script.src = jsonpScriptSrc(chunkId);
  var error = new Error()
  // script标签加载完成后执行方法 method ④
  onScriptComplete = function(event)
  // 设定一个延迟执行方法，如果chunk加载超过设定时间会调用此方法进行超时处理
  var timeout = setTimeout(function() {
    onScriptComplete({ type: "timeout", target: script });
  }, 120000);
  script.onerror = script.onload = onScriptComplete;
  document.head.appendChild(script)
}

// 最后返回一个Promise.all
return Promise.all(promises)

```

解读异步加载的chunk文件

```
// 读取window.webpackJsonp调用push方法(该方法等于 webpackJsonpCallback)
// 传入的数组[chunkId:[1],同步模块的索引key:代码]
// 进行 webpackJsonpCallback调用
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1], {
  3: (function (module, exports, __webpack_require__) {
    exports = module.exports = __webpack_require__(0)(false);
    exports.push([module.i, "html {\n  width: 90%;\n  height: 90vh;\n  background-color: red;\n}", ""]);
  })
}]);
```

解读 method ③

```

// 缓存入参变量
var chunkIds = data[0]
var moreModules = data[1]

// 便利每一个chunkIds，判断installedChunks是否存在该Id，则讲之前创建的__webpack_require__.e方法中创建的promise的resolve方法推入resolves中
var moduleId, chunkId, i = 0, resolves = []
for (; i < chunkIds.length; i++) {
  chunkId = chunkIds[i];
  if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
    resolves.push(installedChunks[chunkId][0]);
  }
  installedChunks[chunkId] = 0;
}

// 遍历传入webpackJsonpCallback方法中的第二个参数
// 讲模块代码同步到modules中
for (moduleId in moreModules) {
  if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
    modules[moduleId] = moreModules[moduleId];
  }
}

// 调用缓存起来的push方法，将入参推入到window.webpackJsonp中
if (parentJsonpFunction) parentJsonpFunction(data)

// 循环resolves，推出每个resolve完成每个chunk的加载
while (resolves.length) {
  resolves.shift()();
}

```

解读 method ⑤
__webpack_require__.t.bind(null, 3, 7)

```
// 该方法会返回绑定了null为上下文，并且参数为3，7的__webpack_require__.t方法
__webpack_require__.t.bind(null, 3, 7)

// 方法内执行

// 一下流程会用同步方法读取出模块内容
// 并会创建一个新的对象将模块内容赋给default属性，还设置了__esModule，Symbol.toStringTag等值
// 最终返回ns对象
if (mode & 1) value = __webpack_require__(value);
if (mode & 8) return value;
if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
var ns = Object.create(null);
__webpack_require__.r(ns);
Object.defineProperty(ns, 'default', { enumerable: true, value: value });
if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
return ns;

```