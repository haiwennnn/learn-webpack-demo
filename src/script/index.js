import _ from 'lodash'
import rs from '../data/data.xml'
import dm from '../assets/image/1.jpg'
import { square } from './math'
import '../style/style.css'

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

// async function getResult () {
//   var _ = await import( /* webpackChunkName: "lodash" */ 'lodash');
//   return _.join(['Hello', 'webpack_import', square(3)], '-l-')
// }

// function setText (dom, textArray) {
//     dom.innerHTML = textArray.join('-')
// }

var app = document.querySelector('#app')

// getResult().then(data => {
  // app.innerHTML = data
// })

app.innerHTML = _.join(['Hello', 'webpack_import', square(3)], '-l-')


// setText(app, ['Hello', 'webpack2', square(2)])

console.log('xml:', rs)

var btn = document.querySelector('#btn')

btn.onclick = function () {
  import( /* webpackChunkName: "print" */ './print').then(module => {
    var print = module.default
    print()
  })
}


var img = new Image()
img.width = 200
img.height = 300
img.src = dm
document.querySelector('#img').appendChild(img)

// if (module.hot) {
//     module.hot.accept('./print.js', function () {
//         console.log('Accepting the updated printMe module!')
//         printMe()
//     })
// }
