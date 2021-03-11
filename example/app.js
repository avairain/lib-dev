import  '../lib/cdn/main'
import React from 'react'
import ReactDom from 'react-dom'
import '../public/markdown.css'
// a()
console.log(window.pandoraModules)
const { B } = window.pandoraModules

ReactDom.render(<B />, document.querySelector('#example-root'))