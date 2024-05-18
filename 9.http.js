const http = require('node:http') // protocolo HTTP
const { findAvailablePort } = require('./10.free-port.js')
const server = http.createServer((req, res) => {
  console.log('request received')
  res.end('hola mundo')
})

findAvailablePort('3000').then((port) => {
  server.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`)
  })
})
