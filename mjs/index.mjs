// .js -> por defecto utiliza CommonJS
// .mjs -> para utilizar ES Modules
// .cjs -> para utilizar forzadamente el CommonJS

import { div, sum, mul } from './sum.mjs'

console.log( sum(1,4) )

console.log( div(1,4) )

console.log( mul(1,4) )
