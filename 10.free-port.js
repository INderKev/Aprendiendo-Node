const net = require('node:net')
function findAvailablePort(desiredPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desiredPort, () => {
      const { port } = server.address()
      server.close(() => {
        resolve(port)
      })
    })

    server.on('error', (error) => {
      if (error === 'EADDRINUSE') {
        findAvalablePort(0).then(port => resolve(port))
      } else {
        reject(error)
      }
    })
  })
}

module.exports = { findAvailablePort }
