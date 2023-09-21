const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js')
// Crypto es una libreria nativa de nodejs que crear ids
const PORT = process.env.PORT ?? 3000

const app = express()
// parsea nuestro json y junta los chuncks
app.use(express.json())
// esto acepta todo si no quieres que acepte todo
app.use(cors())
// si quieres que acepte solo lo que tu quieras
// app.use(cors({
//   origin: (origin, callback) => {
//     const ACCEPTED_ORIGINS = [
//       'http://localhost:8080',
//       'http://localhost:1234',
//       'https://movies.com',
//       'https://midu.dev'
//     ]

//     if (ACCEPTED_ORIGINS.includes(origin)) {
//       return callback(null, true)
//     }

//     if (!origin) {
//       return callback(null, true)
//     }

//     return callback(new Error('Not allowed by CORS'))
//   }
// }))
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'Hola mundo desde message' })
})
// Para poder crear filtros es necesario editar el endpoint normal
// asi que lo comento pero este seria el endpoint basico
// app.get('/movies', (req, res) => {
//   res.json(movies)
// })

// Supongamos que quieres aceptar el crossorigin desde diferentes paginas
// const ACCEPTED_ORIGINS = [
//   'http://localhost:8080',
//   'http://localhost:3000',
//   'http://localhost:8081',
//   'http://movies_some.com',
//   'http://192.168.1.176:8080'
// ]
// End point con filtros
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      // hay dos maneras de hacer esto, con el include somos Case sensitive
      // es decir no diferenciamos entre minisculas y mayusculas
      // osea que si buscamos Action nos encuentra pero si buscamos action no
      // movie => movie.genre.includes(genre)
      // para arreglar esto podemos usar el some
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      // de esta manera hacemos la comparacion de la url poniendo ambos valores
      // en miniscula
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

// esto es una ruta que está buscando por id
// podemos añadir tantos parametros como queramos
app.get('/movies/:id', (req, res) => {
  // el {} solo se pone cuando es un paramtro de la url
  const { id } = req.params
  // movies.find es como en doctrine el findall o el findbyid para un array
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

// CREAMOS PELICULA

app.post('/movies', (req, res) => {
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

  const newMovie = {
    id: crypto.randomUUID(), // crea un uuid aleatorio un UUID es un universal unique identifier
    // recibe todo la data del result
    ...result.data
    // title,
    // genre,
    // year,
    // director,
    // duration,
    // rate: rate ?? 0, // que puede ser nulo
    // poster
  }
  // Esto es un ejemplo de que no todas las APIS son REST
  // esta es una API normal porqyue guardamos el estado de la aplicacion en memoria
  // y bueno lo que se hace aqui es pushear a la base de datos
  movies.push(newMovie)

  // devolvemos un codigo 201 y actualizamos el cliente. 201 porque es el status code de creado https://http.cat/status/201
  res.status(201).json(newMovie)
})

// ACTUALIZAMOS PELICULA PATCH
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params
  // movies.find es como en doctrine el findall o el findbyid para un array
  const movieIndex = movies.find(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

// BORRAMOS PELICULAS CON DELETE
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.listen(PORT, () => {
  console.log('tamos escuchando')
  console.log(`servidor escuchando en el puerto http://localhost:${PORT}`)
})
