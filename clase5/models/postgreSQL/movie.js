import pg from 'pg'
import 'dotenv/config'

const { Client } = pg

/* const config = {
  user: process.env.USERDB,
  password: process.env.PASSWORDDB,
  host: process.env.HOSTDB,
  port: process.env.PORTDB,
  database: process.env.NAMEDB
} */

const config = {
  user: 'postgres',
  password: 'contra',
  host: 'localhost',
  port: 5432,
  database: 'moviesdatabase'
}

const client = new Client(config)

await client.connect()

client.on('error', (err) => {
  console.error('something bad has happened!', err.stack)
})

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const result = await client.query(
        'SELECT p.* from movie p, genre g , movie_genre x WHERE p.movie_id = x.id_movie AND x.id_genre = g.id_genre AND g.name = $1;',
        [lowerCaseGenre])
      return (result.rows)
    }
  }

  static async getById ({ id }) {
    if (id === '') {
      return []
    }
    const result = await client.query(
      'SELECT * FROM movie m WHERE m.movie_id = $1',
      [id])
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

    const { rows: [{ uuid_generate_v1: uuid }] } = await client.query('SELECT uuid_generate_v1 ();')

    try {
      // Save de movie
      await client.query(
        'INSERT INTO movie (movie_id, title, year, director, duration, poster, rate ) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // TODO manejar error para que no lo vea el usuario
      throw new Error('Error creating  the movie')
      // Enviar el error a un servicio interno
    }

    const idGenres = []

    try {
      // Searching the id of the genres
      for (const genre of genresInput) {
        // get the id of the genre
        const result = await client.query(
          'SELECT g.id_genre FROM genre g WHERE LOWER(g.name) = LOWER($1);',
          [genre]
        )
        idGenres.push(result.rows[0].id_genre)
      }
    } catch (error) {
      throw new Error('Error al obtener los id de los generos')
    }

    try {
      // create the relationship in the table
      for (const idGenre of idGenres) {
        await client.query(
          'INSERT INTO movie_genre (id_movie, id_genre) VALUES ($1, $2);',
          [uuid, idGenre]
        )
      }
    } catch (error) {
      throw new Error('Error at time of create the relation between the movie the genres')
    }

    try {
      const newMovie = await client.query(
        'SELECT m.* FROM movie m WHERE m.movie_id = $1',
        [uuid]
      )
      newMovie.rows[0].genres = genresInput
      return newMovie.rows[0]
    } catch (error) {
      throw new Error('Error when searching the movie xd')
    }
  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
