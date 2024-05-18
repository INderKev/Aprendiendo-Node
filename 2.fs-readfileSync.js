const fs = require('node:fs')

//SINCRONO (bloquea todo el hilo)
const text = fs.readFileSync('./archivo.txt', 'utf-8') 

console.log(text)

