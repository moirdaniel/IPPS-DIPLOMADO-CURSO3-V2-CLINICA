// Guardamos el secreto en .env para no compartirlo al publicar el proyecto.
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRA = '2h'

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('Configura JWT_SECRET en .env con al menos 32 caracteres')
}
