//Estos sólo en los módulos que no tienen promesas nativas

//const { promisify } = require ('node: util')
//const readFilePromise = promisify(fs.readFile)

const fs = require('node:fs/promises')
fs.readFile('./archivo.txt', 'utf-8') 
    .then( text =>{
        console.log(text)
    }

    )

console.log('Hola mundo de nuevo')

