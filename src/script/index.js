import rs from '../data/data.xml'
import dm from '../assets/image/1.jpg'
import printMe from './print'
import { square } from './math'
import '../style/style.css'

function setText(dom, textArray) {
    dom.innerHTML = textArray.join('-')
}

var app = document.querySelector('#app')

setText(app, ['Hello', 'webpack2', square(2)])

console.log('xml:', rs)

printMe()

var img = new Image()
img.width = 200
img.height = 300
img.src = dm
document.querySelector('#img').appendChild(img)

if (module.hot) {
    module.hot.accept('./print.js', function () {
        console.log('Accepting the updated printMe module!')
        printMe()
    })
}
