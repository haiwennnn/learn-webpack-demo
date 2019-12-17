module.exports = function (source, map, meta) {
  console.log('source:', source)
  console.log('map:', map)
  console.log('meta:', meta)
  console.log('resolve:', this.resolve(source))
  console.log('typeof source:', typeof source)
}

module.exports.pitch = function (req) {
  console.log('req:', req)
}