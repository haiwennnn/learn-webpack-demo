const getOptions = require('loader-utils').getOptions

module.exports = function (source, map, meta) {
  console.log('source:', source)
  console.log('options:', getOptions(this))
  console.log('map:', map)
  console.log('meta:', meta)
  console.log('typeof source:', typeof source)
  return `export default ${JSON.stringify(source + ' abcd')}`
}

module.exports.pitch = function (req, precedingRequest, data) {
  // console.log('this:', this)
  console.log('req:', req)
  console.log('precedingRequest:', precedingRequest)
  console.log('data:', data)
}