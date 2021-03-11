const marked = require('marked')
const fs = require('fs')
const babel = require('@babel/core')

const getJsxList = function (md) {
  const s = md.match(/\`\`\`(tsx|jsx|js|ts)/)
  const e = md.match(/\`\`\`[^tsx|jsx|js|ts]/)
  if (s && e) {
    const start = s.index
    const end = e.index
    const str = md.slice(start + 3 + s[1].length, end)
    const _md = md.slice(end + 3)
    return [str, ...getJsxList(_md)]
  }
  return []
}

const getNewMd = function (md) {
  const s = md.match(/\`\`\`(tsx|jsx|js|ts)/)
  const e = md.match(/\`\`\`[^tsx|jsx|js|ts]/)
  if (s && e) {
    const start = s.index
    const end = e.index
    const str = md.slice(0, start)
    const _md = md.slice(end + 3)
    return [str, ...getNewMd(_md)]
  }
  return [md]
}

const getMountList = function (md) {
  console.log('%c 🍏 md: ', 'font-size:20px;background-color: #B03734;color:#fff;', md);
  console.log(md.map(v => (v.match(/\#+\s(\w+)\W+$/))))
  return md.map(v => (v.match(/\#+\s(\w+)\W+$/)|| [])[1]).filter(Boolean)
}

module.exports = (src) => {
  console.log(src)
  const md = fs.readFileSync(src.resource).toString()
  console.log(md);
  const _md = getNewMd(md)
  const mountList = getMountList(_md)
  const jsxList = getJsxList(md).map((v, i) => v.replace('mountNode', `"#${mountList[i].toLocaleLowerCase()}"`))
  const t = jsxList.map(v => {
    const c = babel.transformSync(v, {
      filename: 'a.js',
      "presets": [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ],
      "plugins": [
        ["@babel/plugin-transform-typescript", {
          "isTSX": true,
          "allExtensions": true
        }],
        "@babel/plugin-transform-runtime"
      ]
    })
    return c.code
  })
  return `
    ${marked(_md.join(''))}
    <script>
      ${t.join('\n')}
    </script>
  `
}