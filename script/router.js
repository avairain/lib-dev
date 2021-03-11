const http = require('http')
const fs = require('fs')
const marked = require('marked')

const _util = require('./_util')

const { resolve } = _util

const _componentDir = 'src/component'

const componentDir = resolve(_componentDir)

class DispatchRouter {
  baseUrl = 'component'
  locale = 'zh-cn'
  constructor(app, url, port) {
    this.app = app
    this.url = url
    this.port = port
    this.indexStr = null
    this.indexJsStr = null
    this.componentList = null
    this.init()
  }
  init = async () => {
    this.initApp()
    this.initComponentList()
    this.indexStr = await this.initIndex()
    this.indexJsStr = await this.initIndexJs()
  }
  initComponentList = () => {
    const t = fs.readdirSync(componentDir)
    this.componentList = t
  }
  initIndex = () => {
    return new Promise(resolve => {
      http.get(`${this.url}`, res => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
              try {
                resolve(rawData)
                // res.send(rawData + `
                //   <script>
                //     document.querySelector('#markdown-wrap').innerHTML = \`${marked(s)}\`
                //   </script>
                // `)
              } catch (e) {
                console.error(e.message);
              }
            });
          })
    })
  }
  initIndexJs = () => {
    return new Promise(resolve => {
      http.get(`${this.url}/bundle.js`, res => {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
              try {
                resolve(rawData)
                // res.send(rawData + `
                //   <script>
                //     document.querySelector('#markdown-wrap').innerHTML = \`${marked(s)}\`
                //   </script>
                // `)
              } catch (e) {
                console.error(e.message);
              }
            });
          })
    })
  }
  initApp = () => {
    this.app.use('/component/:c', (req, res, next) => {
      const { c } = req.params
      if (c.indexOf('bundle.js') + 1) {
        return res.send(this.indexJsStr)
      }
      let [component, locale] = c.split('-')
      if (locale === 'cn' || locale === undefined) {
        locale = 'zh-cn'
      }
      const t = this.getComponentFileName(component, `index.${locale}.md`)
      try {
        const md = fs.readFileSync(t)
        res.send(this.indexStr + `
                  <script>
                    document.querySelector('#markdown-wrap').innerHTML = \`${marked(md.toString())}\`
                  </script>`)
      } catch (error) {
        console.log(error);
        res.send('404')      
      }
    })
  }
  getComponentFileName = (component, fileName) => {
    const c = this.componentList.find(v => new RegExp(v, 'i').test(component))
    return resolve(`${_componentDir}/${c}/${fileName}`)
  }
}

module.exports = DispatchRouter
