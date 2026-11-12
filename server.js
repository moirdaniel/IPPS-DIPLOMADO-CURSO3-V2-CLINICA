import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { conectar } from './config/db.js'
import { authRoutes } from './routes/auth.routes.js'
import { pacienteRoutes } from './routes/paciente.route.js'
import { medicoRoutes } from './routes/medico.routes.js'
import { Medico } from './models/medico.model.js'
import { Paciente } from './models/paciente.model.js'

// Creamos la aplicación y permitimos recibir datos en formato JSON.
const app = express()
app.use(cors())
app.use(express.json())

// Cada router reúne las rutas de una parte de la API.
app.use('/auth', authRoutes)
app.use('/medicos', medicoRoutes)
app.use('/pacientes', pacienteRoutes)

// Si la dirección no existe, respondemos con un error claro.
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

// Aquí llegan los errores de las rutas para responder siempre en JSON.
app.use((error, req, res, next) => {
  // Los servicios pueden avisar que falta autorización o que un dato es inválido.
  if ([400, 401, 403, 404].includes(error.status)) {
    return res.status(error.status).json({ error: error.message })
  }
  if (error.name === 'ValidationError' || error.name === 'CastError' ||
      error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Revisa los datos enviados' })
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: 'Ya existe un registro con esos datos' })
  }
  res.status(500).json({ error: 'No se pudo completar la operación' })
})

try {
  // Primero conectamos MongoDB y después encendemos el servidor.
  await conectar()
  // Esperamos los índices únicos para detectar emails y RUT repetidos.
  await Promise.all([Medico.init(), Paciente.init()])
  const PORT = Number(process.env.PORT || 4100)
  const servidor = app.listen(PORT)
  servidor.on('listening', () => {
    console.log(`API clínica en http://localhost:${servidor.address().port}`)
  })

  // Si el puerto está ocupado, avisamos y cerramos la conexión.
  servidor.on('error', async (error) => {
    console.error('No se pudo iniciar el servidor:', error.code)
    await mongoose.disconnect()
    process.exitCode = 1
  })

  // Al presionar Ctrl + C dejamos de recibir consultas y cerramos MongoDB.
  const cerrar = () => servidor.close(async () => {
    await mongoose.disconnect()
    process.exit(0)
  })
  process.once('SIGINT', cerrar)
  process.once('SIGTERM', cerrar)
} catch {
  // No mostramos la conexión porque podría contener una contraseña.
  console.error('No se pudo conectar a MongoDB. Revisa MONGODB_URI en .env y que MongoDB esté encendido.')
  await mongoose.disconnect()
  process.exitCode = 1
}
