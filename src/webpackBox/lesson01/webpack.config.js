const path = require("path");
const webpack = require("webpack");
console.log(path.resolve(__dirname, "./index.js"));
module.exports = {
  entry: path.resolve(__dirname, "./index.js"),
  mode: "production",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist")
  },
  optimization: {
    minimize: false
  }
};
