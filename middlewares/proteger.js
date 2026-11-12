import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

export const proteger = (req, res, next) => {
  // Buscamos el token en el encabezado de la solicitud.
  const header = req.headers.authorization

  if (!header || !/^Bearer \S+$/.test(header)) {
    return res.status(401).json({ error: 'Falta el token' })
  }
  // Quitamos la palabra Bearer para quedarnos solo con el token.
  const token = header.split(' ')[1]

  try {
    // Verificamos la firma y el vencimiento antes de dejar pasar la consulta.
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
    // Un token firmado también debe contener el id de un médico.
    if (typeof payload !== 'object' || typeof payload.id !== 'string' ||
        !/^[a-f\d]{24}$/i.test(payload.id)) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    // Dejamos los datos del médico disponibles para la siguiente función.
    req.medico = payload
    next()
  } catch {
    return res.status(401).json({
        error: 'Token inválido o expirado'
    })
}}
