const path = require('path')
const portfinder = require('portfinder')
const rmrf = require('rmrf')
const os = require('os')

const resolve = (pathString = '') => {
  return path.join(__dirname, '../', pathString)
}
const throwErr = (e) => {
  throw new Error(e)
}

const getVaidPort = (port = 3000) => {
  console.log('port: ', port);
  return new Promise(resolve => {
    portfinder.getPortPromise({
      port,
      stopPort: port + 1000
    })
      .then(e => {
        resolve(e)
      })
  })
}

const getIpAddress = () => {
  var ifaces=os.networkInterfaces()

  for (var dev in ifaces) {
    let iface = ifaces[dev]

    for (let i = 0; i < iface.length; i++) {
      let {family, address, internal} = iface[i]

      if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
        return address
      }
    }
  }
}

const clean = () => {
  [resolve('dist'), resolve('lib'), resolve('docs')].forEach(v => rmrf(v))
}

module.exports = {
  resolve,
  throwErr,
  getVaidPort,
  getIpAddress,
  clean,
}
