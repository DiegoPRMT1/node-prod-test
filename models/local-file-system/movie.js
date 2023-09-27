import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils.js'
const movies = readJSON('./movies.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return movies.filter(
      // hay dos maneras de hacer esto, con el include somos Case sensitive
      // es decir no diferenciamos entre minisculas y mayusculas
      // osea que si buscamos Action nos encuentra pero si buscamos action no
      // movie => movie.genre.includes(genre)
      // para arreglar esto podemos usar el some
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      // de esta manera hacemos la comparacion de la url poniendo ambos valores
      // en miniscula
      )
    }
    return movies
  }

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(), // crea un uuid aleatorio un UUID es un universal unique identifier
      // recibe todo la data del result
      ...input
    }
    movies.push(newMovie)

    return newMovie
  }

  static async delete (id) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false

    movies.splice(movieIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const movieIndex = movies.find(movie => movie.id === id)
    if (movieIndex === -1) return false

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }

    return movies[movieIndex]
  }
}
