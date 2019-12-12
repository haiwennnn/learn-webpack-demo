import _ from 'lodash'
import rs from '../data/data.xml'
import xj from '../assets/image/WechatIMG1525.jpeg'
import printMe from './print'
import '../style/style.css'

function setText(dom, textArray) {
    dom.innerHTML = _.join(textArray, ' ')
}

var app = document.querySelector('#app')

setText(app, ['Hello', 'webpack11'])

console.log('xml:', rs)

printMe()

var img = new Image()
img.width = 200
img.height = 300
img.src = xj
document.querySelector('#img').appendChild(img)