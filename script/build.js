const webpack = require('webpack')
const { merge } = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin')

const util = require('./_util')
const { throwErr, clean, resolve } = util

const src = resolve('src')
const libSrc = resolve('lib/src')
const page = resolve('public/index.html')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: page,
  filename: "./index.html",
  minify: false,
  inject: 'body'
});

const { webpackConfig } = require('./webpack.config')
const buildCdn = require('./buildcdn')
const buildEm = require('./buildem')
const buildEs = require('./buildes')

clean()
const compiler = webpack(merge(webpackConfig, {
  plugins: [
    htmlWebpackPlugin,
    new CopyPlugin({
      patterns: [
        {
          from: src,
          to: libSrc
        },
        {
          from: 'src/**/*.md',
          to: (e) => {
            const ma = e.absoluteFilename.match(/\\([a-z|A-Z]+)\\[\w|-]+(\.([\w|-]+))?\.md$/i)
            const name = (ma[1] || '') + (ma[2] || '').toLocaleLowerCase()
            if (name === 'locale') return e.absoluteFilename
            const s = e.context + '\\docs\\' + name + '.md'
            return s
          }
        }
      ]
    }),
  ],
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new webpack.TerserWebpackPlugin({
  //       extractComments: false
  //     })
  //   ]
  // }
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
  buildCdn()
  buildEm()
  buildEs()
  // return stats
})

