import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    // if (genre) {
    //   const filteredMovies = movies.filter(
    //     // hay dos maneras de hacer esto, con el include somos Case sensitive
    //     // es decir no diferenciamos entre minisculas y mayusculas
    //     // osea que si buscamos Action nos encuentra pero si buscamos action no
    //     // movie => movie.genre.includes(genre)
    //     // para arreglar esto podemos usar el some
    //     movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    //     // de esta manera hacemos la comparacion de la url poniendo ambos valores
    //     // en miniscula
    //   )
    //   return res.json(filteredMovies)
    // }
    // ------------------------- lo mismo pero lo paso a un modelo/componente
    const movies = await MovieModel.getAll({ genre }) // hace lo mismo que la linea de arriba devuelve o todas las pelis o las filtradas
    res.json(movies)
    // DIEGO DEL FUTURO ESTO ES UNA NOTA --------
    // VALE LA FUNCION ESTA ES ORIGINALMENTE SINCRONA PERO LA CONVERTISTE A ASYNCRONA CON EL ASYN Y EL AWAIT JUST SAYING
  }

  static async getById (req, res) {
    // el {} solo se pone cuando es un paramtro de la url
    const { id } = req.params
    // movies.find es como en doctrine el findall o el findbyid para un array
    // const movie = movies.find(movie => movie.id === id)
    // estamos pasando a asyncrono
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body) // valido todas las peliculas y las devuelvo en el result
    // si result contiene un error entra aqui si no, sigue bajando
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    // const {
    //   title,
    //   genre,
    //   year,
    //   director,
    //   duration,
    //   rate,
    //   poster
    // } = req.body

    // const newMovie = {
    //   id: randomUUID(), // crea un uuid aleatorio un UUID es un universal unique identifier
    //   // recibe todo la data del result
    //   ...result.data
    //   // title,
    //   // genre,
    //   // year,
    //   // director,
    //   // duration,
    //   // rate: rate ?? 0, // que puede ser nulo
    //   // poster
    // }
    // // Esto es un ejemplo de que no todas las APIS son REST
    // // esta es una API normal porqyue guardamos el estado de la aplicacion en memoria
    // // y bueno lo que se hace aqui es pushear a la base de datos
    // movies.push(newMovie)
    // ------------- TAMOS PASANDO A ASYNCRONO EL DE ARRIBA ES SINCRONO DIEGO DEL FUTURO NO LA LIES
    const newMovie = await MovieModel.create({ input: result.data })

    // devolvemos un codigo 201 y actualizamos el cliente. 201 porque es el status code de creado https://http.cat/status/201
    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    // const movieIndex = movies.findIndex(movie => movie.id === id)
    // esta logica la hemos movido
    const result = await MovieModel.delete({ id })

    // if (movieIndex === -1) {
    //   return res.status(404).json({ message: 'Movie not found' })
    // }
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    // movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    // // movies.find es como en doctrine el findall o el findbyid para un array
    // const movieIndex = movies.find(movie => movie.id === id)
    // if (movieIndex === -1) {
    //   return res.status(404).json({ message: 'Movie not found' })
    // }

    // const updateMovie = {
    //   ...movies[movieIndex],
    //   ...result.data
    // }

    // movies[movieIndex] = updateMovie
    const updateMovie = await MovieModel.update({ id, input: result.data })
    return res.json(updateMovie)
  }
}
