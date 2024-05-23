import { createApp } from './app.js'
import { MovieModel } from './models/postgreSQL/movie.js'

createApp({ movieModel: MovieModel })
