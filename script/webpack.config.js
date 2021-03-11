const fs = require('fs')
const marked = require('marked')
const http = require('http')

const util = require('./_util')
const { resolve } = util
const src = resolve('src')
const dist = resolve('dist')
const component = resolve('src/component')
const docs = resolve('docs')
// const indexFile = fs.readFileSync(dist + '/index.html').toString()

const webpackConfig = {
  mode: 'production',
  entry: src + '/index.ts',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(ts|tsx|js|jsx)$/i,
        use: {
          loader: "babel-loader",
          options: {
            cacheCompression: false
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: 'gingkoo-[local]--[hash:base64:5]'
              },
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
              sourceMap: true
            },
          },
          {
            loader: 'less-loader',
            options: {
              modules: false
            }
          }
        ]
      },
      // {
      //   test: /\.md$/,
      //   use: [
      //     'babel-loader',
      //     require('./md.loader')
      //     // {
      //     //   loader: "html-loader"
      //     // },
      //     // {
      //     //   loader: "markdown-loader",
      //     // }
      //   ]
      // }
    ],
  },
  plugins: [
  ],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  }
}

const proxyTable = {
  '/api': {
    target: 'http://127.0.0.1:8080',
    pathRewrite: {
      '^/api': ''
    },
    changeOrigin: true
  }
}

const devConfig = {
  port: 3000,
  host: '0.0.0.0',
  compress: true,
  hot: true,
  contentBase: dist,
  proxy: proxyTable,
  // historyApiFallback: true,
  noInfo: true,
  // clientLogLevel: 'silent',
  stats: 'errors-only',
  overlay: true,
  quiet: true,
  after: function (app, server, compiler) {
    // console.log('%c 🍡 app.port: ', 'font-size:20px;background-color: #ED9EC7;color:#fff;', app.host);
    // app.use('/b-cn', (req, res, next) => {
    //   console.log(req.headers.host, req.baseUrl)
    //   const s = fs.readFileSync(component + '/B/index.zh-cn.md').toString()
    //   const t = http.get(`http://${req.headers.host}/index.html`, resp => {
    //     resp.setEncoding('utf8');
    //     let rawData = '';
    //     resp.on('data', (chunk) => { rawData += chunk; });
    //     resp.on('end', () => {
    //       try {
    //         console.log(rawData);
    //         res.send(rawData + `
    //           <script>
    //             document.querySelector('#markdown-wrap').innerHTML = \`${marked(s)}\`
    //           </script>
    //         `)
    //       } catch (e) {
    //         console.error(e.message);
    //       }
    //     });
    //   })
      // res.render('index', { title: 'b' }, (err, html) => {
      //   console.log("eeee::::", err, html)
      // })
      // next()
    // })
  },
  // writeToDisk: true,
  log: e => {
    console.log(e)
  },
}

module.exports = {
  webpackConfig,
  devConfig,
}