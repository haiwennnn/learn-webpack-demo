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

  // 加载模块的方法，webpack的require包装方法
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

  // create a fake namespace object
  __webpack_require__.t = function(value, mode)

  // 获取 defaultExport function 的兼容方法
  __webpack_require__.n = function(module)

  // 读取所有在window.webpackJsonp对象内存在的chunk代码包
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++)
    webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction

  // 引入同步模块1
  return __webpack_require__((__webpack_require__.s = 1))

})([module1,module2])

```

从引入模块 1 开始，**webpack_require** 在同步代码中已经讲过会调用该 modole

```
function(module, exports, __webpack_require__) {

  // css同步引入同步模块2
  const css = __webpack_require__(2);
  // css02引入异步模块1
  const css02 = __webpack_require__
    .e(/* import() */ 1)
    .then(__webpack_require__.t.bind(null, 3, 7));
  const a = 100;
  console.log(a, css);
  console.log(a, css02);

  /***/
}
```

解读模块 ①
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
  var promise = new Promise(function(resolve, reject) {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  })
  // 推入promises
  promises.push((installedChunkData[2] = promise))

  // 创建script标签
  var script = document.createElement("script");
  var onScriptComplete;
  script.charset = "utf-8";
  script.timeout = 120;
  if (__webpack_require__.nc) {
    script.setAttribute("nonce", __webpack_require__.nc);
  }
  script.src = jsonpScriptSrc(chunkId);
  var error = new Error()
  // script标签加载完成后执行方法
  onScriptComplete = function(event)
  var timeout = setTimeout(function() {
    onScriptComplete({ type: "timeout", target: script });
  }, 120000);
  script.onerror = script.onload = onScriptComplete;
  document.head.appendChild(script)
}

```
