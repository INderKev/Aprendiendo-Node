//Estos sólo en los módulos que no tienen promesas nativas

//const { promisify } = require ('node: util')
//const readFilePromise = promisify(fs.readFile)

//ASINCRONO SECUENCIAL
const fs = require('node:fs/promises');

//  IIFE - Inmediatly Invoked Function Expression
(
    async () => {
        const text = await fs.readFile('./archivo.txt', 'utf-8') 
        console.log(text)
        console.log('Hola mundo de nuevo')
    }
)()

