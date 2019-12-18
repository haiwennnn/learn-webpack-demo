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