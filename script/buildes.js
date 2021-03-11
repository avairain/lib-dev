const child_process = require('child_process')

const util = require('./_util')

const { throwErr } = util

module.exports = () => {
  console.log('开始编译成jsx')
  child_process.exec('npx tsc --outDir lib/es --target es2020 --module es2020 --jsx preserve', {}, (err, message) => {
    if (message) {
      console.log(message)
    }
    if (err) {
      return throwErr(err)
    }
    console.log('成功编译成jsx')
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


