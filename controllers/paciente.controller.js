import * as service from '../services/paciente.service.js'

// Tomamos solo los campos que el cliente puede enviar o editar.
// medico, _id y las fechas de creación no se copian del body.
const camposPermitidos = ['nombre', 'rut', 'fechaNacimiento', 'prevision', 'telefono', 'email']

const leerDatos = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw Object.assign(new Error('Envía los datos del paciente en un objeto JSON'), { status: 400 })
  }

  const datos = {}
  for (const campo of camposPermitidos) {
    if (Object.hasOwn(body, campo)) {
      // Las fechas llegan como texto JSON. El modelo las convierte a Date.
      // Rechazamos objetos y arreglos para no usarlos como datos de una consulta.
      if (typeof body[campo] !== 'string') {
        throw Object.assign(new Error(`El campo ${campo} debe ser texto`), { status: 400 })
      }
      datos[campo] = body[campo]
    }
  }
  return datos
}

export const crear = async (req, res) => {
  const paciente = await service.crear(leerDatos(req.body), req.medico.id)
  res.status(201).json(paciente)
}

export const listar = async (req, res) => {
  const { prevision } = req.query
  if (prevision !== undefined && typeof prevision !== 'string') {
    return res.status(400).json({ error: 'La previsión debe ser texto' })
  }
  res.status(200).json(await service.listar(req.medico.id, prevision))
}

export const buscarPorId = async (req, res) => {
  const paciente = await service.buscarPorId(req.params.id)
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' })
  res.status(200).json(paciente)
}

export const actualizar = async (req, res) => {
  const paciente = await service.actualizar(req.params.id, leerDatos(req.body), req.medico.id)
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' })
  res.status(200).json(paciente)
}

export const eliminar = async (req, res) => {
  const paciente = await service.eliminar(req.params.id, req.medico.id)
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' })
  // El estado 204 confirma la eliminación y no lleva JSON ni otro cuerpo.
  res.status(204).end()
}
