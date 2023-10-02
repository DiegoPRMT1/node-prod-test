import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, HEX(id) id FROM movie;'
    )
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, HEX(id) id 
        FROM movie WHERE HEX(id) = ?;`,
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = input
    console.log(input)

    const [uuidResult] = await connection.query('SELECT UUID() as uuid;')
    const [{ uuid }] = uuidResult
    const uuidHex = Buffer.from(uuid.replace(/-/g, ''), 'hex').toString('hex')
    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
        VALUES ("${uuidHex}", ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      console.error('Error al insertar en la base de datos:', e)
      throw new Error('Hubo un fallito')
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, HEX(id) id 
      FROM movie WHERE HEX(id) = ?;`,
      [uuidHex]
    )

    return movies[0]
  }

  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
