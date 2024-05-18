const fs = require('node:fs/promises')
const path = require('node:path')
const pc = require('picocolors')

const folder = process.argv[2] ?? '.'

async function ls(folder) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch {
    console.error(pc.red(`no se pudo leer el directorio ${folder}`))
    process.exit(1)
  }

  const filePromises = files.map(async file => {
    // path de cada archivo
    const filePath = path.join(folder, file)
    let fileStats

    try {
      fileStats = await fs.stat(filePath)// informaición del directorio
    } catch {
      console.error(`No se puedo obtener información del siguiente archivo o directorio ${file}`)
    }

    const isDirectory = fileStats.isDirectory()
    const fileType = fileStats.fileType ? 'd' : 'f'
    const fileSize = fileStats.size
    const fileModified = fileStats.mtime.toLocaleString()

    return `${isDirectory} ${fileType} ${pc.blue(file.padEnd(20))} ${pc.green(fileSize.toString().padEnd(5))} ${pc.yellow(fileModified.padStart(20))}`
  })

  const filesInfo = await Promise.all(filePromises)
  filesInfo.forEach(fileInfo => console.log(fileInfo))
}

ls(folder)
