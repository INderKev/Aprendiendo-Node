const fs = require('node:fs')

//ASINCRONO
fs.readFile('./archivo.txt', 'utf-8',(err, data) =>{ //<- ejecuta el callback cuando termine de leer, pero sigue ejecutando el código de abajo
    if(err) throw err;
    console.log(data)
})

console.log('Hola mundo de nuevo')

