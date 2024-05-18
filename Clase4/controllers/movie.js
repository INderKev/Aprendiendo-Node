import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie) // se devuleve para actualizar la cache del cliente
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)

    if (result.error) return res.status(404).json({ message: JSON.parse(result.error) })
    const { id } = req.params
    console.log({ data: result.data })
    const updateMovie = await MovieModel.update({ id, input: result.data })

    if (updateMovie === false) return res.status(404).json({ message: 'Movie not found' })
    return res.json(updateMovie)
  }

  static async delete (req, res) {
    const { id } = req.params

    const deletedMovie = await MovieModel.delete({ id })
    if (deletedMovie === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.json({ message: 'Movie deleted' })
  }
}
