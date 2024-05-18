const path = require('node:path')

//muestra el separador de las rutas del sistema operativo que se utiliza
console.log(path.sep)
//unir rutas
const filePath = path.join('content', 'subfolder','tests.txt')
console.log(filePath)

const ext = path.extname('my.sumper.csv')
console.log(ext)