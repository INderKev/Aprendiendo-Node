const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be string',
    required_error: 'Movie title is required. Please, verify'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rete: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Fantasy', 'Biography', 'Drama', 'Romance', 'Sci-Fi', 'Horror', 'Thriller']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )

})

// create a new Movie if it complies with the validations
function validateMovie(object) {
  return movieSchema.safeParse(object)
}

// replace only the field that come in object
function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
