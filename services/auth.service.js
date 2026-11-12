
import { Medico } from '../models/medico.model.js'


import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRA } from '../config/jwt.js'

// Creamos el token con el id y el email del médico, nunca con su contraseña.
const firmarToken = (medico) =>{
    const token =  jwt.sign(
    { id: medico._id, email: medico.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRA }
  )

  return token
}
  

export const registrar = async ( datos ) =>{
    // Guardar el médico ejecuta el hash definido en su modelo.
    const medico = await Medico.create(datos )
 const token = firmarToken(medico)
  return { medico, token }
}


export const login = async (email, password) =>{
    // Si no existe el email o no coincide la contraseña, devolvemos null.
    const medico = await Medico.findOne({ email })
    if(!medico) return null

    const ok = await medico.compararPassword(password)
    if(!ok) return null

   const token = firmarToken(medico)
  return { medico, token }

}
