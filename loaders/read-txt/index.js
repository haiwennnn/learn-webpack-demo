const getOptions = require('loader-utils').getOptions

module.exports = function (content) {
  const options = getOptions(this)

  console.log('content:            ', content)
  console.log('options:            ', options)
  console.log('this.context:       ', this.context)
  console.log('this.request:       ', this.request)
  console.log('this.resourcePath:  ', this.resourcePath)
  console.log('this.resourceQuery: ', this.resourceQuery)
  console.log('this.target:        ', this.target)
  console.log('this.resource:      ', this.resource)

  var callback = this.callback
  const json = content.replace(/\[value\]/, options.value)
  // callback(null, `export default ${json}`)
  // return `export default ${json}`
  return json
}

// module.exports.raw = true;