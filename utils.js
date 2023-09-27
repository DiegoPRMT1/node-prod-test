// como leer un json en ESModules actual
// llamas al create require de node:module
import { createRequire } from 'node:module'
// te devuelve compilado las url del proyecto
const require = createRequire(import.meta.url)
// esta linea es para usarlo de manera global
export const readJSON = (path) => require(path)
// creas una funcion que sea require como si fuese commonJS pero este lo he creado yo
