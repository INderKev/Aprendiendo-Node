

//globalThis es la raiz del arbol de las aplicaciones que estan sobre js
globalThis.console.log('Hola mundo')

//se destructura require import
const { sum } = require('./sum')
console.log( sum(1, 4))