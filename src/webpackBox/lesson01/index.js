const css = require("css-loader!./style.css");
const css02 = import("css-loader!./style02.css")
const a = 100;
console.log(a, css);
console.log(a, css02);