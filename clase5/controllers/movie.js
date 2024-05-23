import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'movie not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (result.error) {
      res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await this.movieModel.create({ input: result.data })
    if (newMovie === false) {
      res.status(400).json({ error: 'Could not create resource' })
    }
    res.status(201).json(newMovie) // se devuleve para actualizar la cache del cliente
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (result.error) return res.status(404).json({ message: JSON.parse(result.error) })
    const { id } = req.params
    console.log({ data: result.data })
    const updateMovie = await this.movieModel.update({ id, input: result.data })

    if (updateMovie === false) return res.status(404).json({ message: 'Movie not found' })
    return res.json(updateMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params

    const deletedMovie = await this.movieModel.delete({ id })
    if (deletedMovie === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    return res.json({ message: 'Movie deleted' })
  }
}
