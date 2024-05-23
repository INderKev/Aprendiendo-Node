import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const config = {
  user: process.env.USERDB,
  password: process.env.PASSWORDDB,
  host: process.env.HOSTDB,
  port: process.env.PORTDB,
  database: process.env.NAMEDB,
  max: 3,
  idleTimeoutMillis: 0
}

const pool = new Pool(config)

// convert ' in " let result = text.replace(/'/g, '"');

export class MovieModel {
  static async getAll ({ genre }) {
    const client = await pool.connect()
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const result = await client.query(
        'SELECT p.* from movie p, genre g , movie_genre x WHERE p.movie_id = x.id_movie AND x.id_genre = g.id_genre AND g.name = $1;',
        [lowerCaseGenre])
      await client.release()
      return (result.rows)
    }
  }

  static async getById ({ id }) {
    if (id === '') {
      return []
    }
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM movie m WHERE m.movie_id = $1',
      [id])
    client.release()
    return (result.rows)
  }

  static async create ({ input }) {
    const {
      genre: genresInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const client = await pool.connect()

    const { rows: [{ uuid_generate_v1: uuid }] } = await client.query('SELECT uuid_generate_v1 ();')

    try {
      // Creating the transaction
      await client.query('BEGIN')
      // Creation of query for save the movie
      const queryCreateMovie = 'INSERT INTO movie (movie_id, title, year, director, duration, poster, rate ) VALUES ($1, $2, $3, $4, $5, $6, $7)'
      await client.query(
        queryCreateMovie,
        [uuid, title.toLowerCase(), year, director.toLowerCase(), duration, poster, rate]
      )

      const idGenres = []

      // Searching the id of the genres
      for (const genre of genresInput) {
        // get the id of the genre
        const result = await client.query(
          'SELECT g.id_genre FROM genre g WHERE LOWER(g.name) = LOWER($1)',
          [genre.toLowerCase()]
        )
        idGenres.push(result.rows[0].id_genre)
      }

      // create the relationship in the table
      for (const idGenre of idGenres) {
        await client.query(
          'INSERT INTO movie_genre (id_movie, id_genre) VALUES ($1, $2);',
          [uuid, idGenre]
        )
      }
      const newMovie = await client.query(
        'SELECT m.* FROM movie m WHERE m.movie_id = $1',
        [uuid]
      )
      await client.query('COMMIT')
      await client.release()
      newMovie.rows[0].genres = genresInput
      return newMovie.rows[0]
    } catch (error) {
      try {
        await client.query('ROLLBACK')
        // Rollback sucess so release to pool
        await client.release()
      } catch (roolbackErr) {
        console.error('ROLLBACK ERROR: %s', roolbackErr)
        // The connection is broken
        await client.release(roolbackErr)
      }
      throw error
    }
  }

  static async delete ({ id }) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const queryDeleteMovieGenre = 'DELETE FROM movie_genre WHERE id_movie = $1'
      await client.query(queryDeleteMovieGenre, [id])
      const queryDeleteMovie = 'DELETE FROM movie WHERE movie_id = $1'
      await client.query(queryDeleteMovie, [id])
      await client.query('COMMIT')
      return true
    } catch (error) {
      try {
        await client.query('ROLLBACK')
        await client.release()
        console.error(error)
        return false
      } catch (err) {
        await client.release(err)
        return false
      }
    }
  }

  static async update ({ id, input }) {
    if (id === '') {
      return true
    }
    const client = await pool.connect()
    try {
      // recover the old movie
      const oldMovie = await client.query(
        'SELECT * FROM movie m WHERE m.movie_id = $1',
        [id])
      const resultOldGenres = await client.query(
        'SELECT g.name FROM movie_genre k, genre g WHERE k.id_movie = $1 AND k.id_genre = g.id_genre;'
        , [id])
      const updatedMovie = { ...oldMovie.rows[0], ...input, genres: Object.values(resultOldGenres.rows[0]) }
      console.log(updatedMovie)
      await client.query('BEGIN')
      const queryUpdateMovie = 'UPDATE movie SET (title, year, director, duration, poster, rate) = ($1,$2,$3,$4,$5,$6) WHERE movie_id = $7'
      await client.query(queryUpdateMovie, [updatedMovie.title, updatedMovie.year, updatedMovie.director, updatedMovie.duration, updatedMovie.poster, updatedMovie.rate, id])
      // const queryUpdateGenres = 'UPDATE movie_genre SET'
      const newMovie = await client.query(
        'SELECT * FROM movie m WHERE m.movie_id = $1',
        [id])
      client.release()
      return (newMovie.rows)
    } catch (err) {
      client.release(err)
      return false
    }
  }
}
