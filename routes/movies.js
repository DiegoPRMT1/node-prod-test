import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()
  const movieController = new MovieController({ movieModel })

  // no podemos el /movies porque luego redireccionaremos todas las rutas que sean / a /movies
  moviesRouter.get('/', movieController.getAll)

  moviesRouter.get('/:id', movieController.getById)

  moviesRouter.post('/', movieController.create)

  moviesRouter.delete('/:id', movieController.delete)

  moviesRouter.patch('/:id', movieController.update)

  return moviesRouter
}
