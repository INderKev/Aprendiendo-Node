import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ movieModel }) => {
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

  app.use('/movies', createMovieRouter({ movieModel }))

  app.listen(PORT, () => {
    console.log(`Server listen on PORT http://localhost:${PORT}`)
  })
}
