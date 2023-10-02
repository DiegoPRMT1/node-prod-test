import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json')) no recomendada
// Crypto es una libreria nativa de nodejs que crear ids
export const createApp = ({ movieModel }) => {
  const app = express()
  // parsea nuestro json y junta los chuncks
  app.use(json())
  // esto acepta todo si no quieres que acepte todo
  // app.use(cors())
  // si quieres que acepte solo lo que tu quieras
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  // app.get('/', (req, res) => {
  //   res.json({ message: 'Hola mundo desde message' })
  // })
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
  // // End point con filtros
  // app.get('/movies', todo)

  // // esto es una ruta que está buscando por id
  // // podemos añadir tantos parametros como queramos
  // app.get('/movies/:id', todo)

  // // CREAMOS PELICULA

  // app.post('/movies', todo)

  // // ACTUALIZAMOS PELICULA PATCH
  // app.patch('/movies/:id', todo)

  // // BORRAMOS PELICULAS CON DELETE
  // app.delete('/movies/:id', todo)
  // ----------------------------------------------------
  // como hemos sacado toda la lógica de este controlador y la hemos pasamos a /routes/movies lo que hacemos el llamar a todas las rutas para /movies
  app.use('/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log('tamos escuchando')
    console.log(`servidor escuchando en el puerto http://localhost:${PORT}`)
  })
}
