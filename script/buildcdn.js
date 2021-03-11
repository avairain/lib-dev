const webpack = require('webpack')
const { merge } = require("webpack-merge")

const util = require('./_util')
const { webpackConfig } = require('./webpack.config')

const { throwErr, resolve } = util

const lib = resolve('lib')
const cdn = resolve('lib/cdn')

module.exports = () => {
  console.log('开始编译成cdn')
  const compiler = webpack(merge(webpackConfig, {
    output: {
      path: cdn,
      filename: '[name].js',
      libraryTarget: 'umd',
      library: 'pandoraModules',
    }
  }))

  compiler.run((err, stats) => {
    if (err) {
      if (err.message) {
        return throwErr(err.message)
      }
    }
    const { errors, warnings } = stats.toJson({ all: false, warnings: true, errors: true })
    if (errors && errors.length) {
      return throwErr(errors.map(v => v.message))
    }
    console.log(stats.toString({
      chunks: false, 
      colors: true
    }));
    console.log('成功编译成cdn')
    // return stats
  })
}


