import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

const app = express()

app.use(corsMiddleware())

const PORT = process.env.PORT ?? 3000
// parsea todas las peticiones
app.use(json())
app.disable('x-powered-by')

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`Server listen on PORT http://localhost:${PORT}`)
})
