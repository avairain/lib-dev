import App,{ a, B } from '../src'
import React from 'react'
import ReactDom from 'react-dom'
import '../public/markdown.css'
a()

ReactDom.render(<B />, document.querySelector('#example-root'))