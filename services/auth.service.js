import { Medico } from '../models/medico.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRA } from '../config/jwt.js'

// El token lleva el id y el email, nunca la contraseña ni su hash.
const firmarToken = (medico) => jwt.sign(
  { id: medico.id, email: medico.email },
  JWT_SECRET,
  { algorithm: 'HS256', expiresIn: JWT_EXPIRA }
)

export const registrar = async (datos) => {
  // create ejecuta el pre(save) del modelo y guarda la contraseña como hash.
  const medico = await Medico.create(datos)
  return { medico, token: firmarToken(medico) }
}

// Este hash permite hacer una comparación aunque el email no exista.
// Así evitamos responder más rápido solo porque no encontramos ese email.
const hashDeComparacion = await bcrypt.hash('Comparacion-interna-sin-usuario', 10)

export const login = async (email, password) => {
  const medico = await Medico.findOne({ email })
  const coincide = medico
    ? await medico.compararPassword(password)
    : await bcrypt.compare(password, hashDeComparacion)

  if (!medico || !coincide) return null
  return { medico, token: firmarToken(medico) }
}
