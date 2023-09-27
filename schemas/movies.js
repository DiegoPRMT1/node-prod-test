import zod from 'zod'

const movieSchema = zod.object({
  title: zod.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  // validaciones con zod
  year: zod.number().int().positive().min(1900).max(2024),
  director: zod.string(),
  duration: zod.number().int().positive(),
  rate: zod.number().min(0).max(10).default(5), // si quieres decir que es opcional le pones un default y con esto entiende que puedes poner el rate o
  poster: zod.string().url({
    message: 'Poster must be a valid URL'
  }),
  // el genero puede tener varias opciones para ello lo que usamos es enum y al final añadimos el array()
  genre: zod.array(
    zod.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Terror', 'Thriller']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of enum'
    }
  )
})
export function validateMovie (object) {
  // return movieSchema.parse(object)
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (object) {
  // partial hace que todas las propiedades de un objeto sean opcionales
  return movieSchema.partial().safeParse(object)
}
