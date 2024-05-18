const fs = require('node:fs')

fs.readdir('.', (err, data) => {
  if (err) throw console.log(err)
  data.forEach(file => {
    console.log(file)
  })
})
