import * as service from '../services/auth.service.js'

// Revisamos los datos antes de mandarlos a MongoDB.
const emailValido = (email) => typeof email === 'string' &&
  email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const registrar = async (req, res) => {
  const { nombre, especialidad, email, password } = req.body || {}

  if (typeof nombre !== 'string' || !nombre.trim() ||
      typeof especialidad !== 'string' || !especialidad.trim() ||
      !emailValido(email) || typeof password !== 'string' ||
      password.length < 6 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Envía nombre, especialidad, email válido y password de al menos 6 caracteres y máximo 72 bytes' })
  }

  // Elegimos los campos permitidos. No guardamos todo lo que mande el cliente.
  const resultado = await service.registrar({
    nombre, especialidad, email: email.trim().toLowerCase(), password
  })
  res.status(201).json(resultado)
}

export const login = async (req, res) => {
  const { email, password } = req.body || {}
  if (!emailValido(email) || typeof password !== 'string' ||
      !password.length || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Envía email y password válidos' })
  }

  const resultado = await service.login(email.trim().toLowerCase(), password)
  // Usamos el mismo mensaje para email inexistente y contraseña incorrecta.
  if (!resultado) return res.status(401).json({ error: 'Email o contraseña incorrectos' })
  res.status(200).json(resultado)
}
