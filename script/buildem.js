const child_process = require('child_process')

const util = require('./_util')

const { throwErr } = util

module.exports = () => {
  console.log('开始编译成es5')
  child_process.exec('npx babel src --out-dir lib/em --extensions ".ts,.tsx" --ignore "src/typings" ', {}, (err, message) => {
    if (message) {
      console.log(message)
    }
    if (err) {
      return throwErr(err)
    }
    console.log('成功编译成es5')
  })
  child_process.exec('npx less-watch-compiler src lib/em --run-once', {}, (err, message) => {
    if (message) {
      console.log(message)
    }
    if (err) {
      return throwErr(err)
    }
  })
}


