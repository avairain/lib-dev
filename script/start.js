const webpack = require('webpack')
const { merge } = require("webpack-merge")
const webpackDevServer = require('webpack-dev-server')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const opn = require('opn')
const child_process = require('child_process')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin')

console.clear()

console.error('修改 example/app.js 中的文件实现单一组件预览')

const util = require('./_util')
const { webpackConfig, devConfig } = require('./webpack.config')
const DispatchRouter = require('./router')

const { throwErr, getVaidPort, resolve } = util
const src = resolve('src')
const libSrc = resolve('lib/src')

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: resolve('example/index.html'),
  filename: "./index.html",
  minify: false,
  inject: 'body'
});

const { port, host, https } = devConfig
// child_process.exec('npm run build', {}, (err, message, ...c) => {
//   if (err) {
//     return throwErr(err)
//   }
//   console.log('成功编译成jsx')
// })


getVaidPort(port)
  .then(p => {
      const config = merge(webpackConfig, {
      mode: 'development',
      devtool: 'source-map',
      entry: resolve('example/app'),
      plugins: [
        htmlWebpackPlugin,
        new webpack.SourceMapDevToolPlugin(),
        new webpack.HotModuleReplacementPlugin(),
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
        new FriendlyErrorsWebpackPlugin({
          compilationSuccessInfo: {
            messages: [`You application is running here ${https ? 'https' : 'http'}://${host === '0.0.0.0' ? 'localhost' : host}:${p}`],
          },
          clearConsole: false
        })
      ],
      // stats: {
      //   logging: 'error'
      // }
    })
    const compiler = webpack(config)
    const devServer = new webpackDevServer(compiler, {
      ...devConfig,
      after: (app) => {
        // new DispatchRouter(app, `${https ? 'https' : 'http'}://${host === '0.0.0.0' ? 'localhost' : host}:${p}`, p)
      }
    })
    devServer.listen(p, host, (err) => {
      if (err) {
        return console.log('err:' ,err.code)
      }
      opn(`${https ? 'https' : 'http'}://${host === '0.0.0.0' ? 'localhost' : host}:${p}`)
      console.log('server start')
    })
  })
  
