import * as service from '../services/medico.service.js'

export const listar = async (req, res) => {
  const { especialidad } = req.query
  if (especialidad !== undefined && typeof especialidad !== 'string') {
    return res.status(400).json({ error: 'La especialidad debe ser texto' })
  }
  // Una búsqueda sin resultados devuelve 200 con [], no es un error.
  res.status(200).json(await service.listar(especialidad))
}

export const perfil = async (req, res) => {
  // El middleware dejó en req.medico el id de quien inició sesión.
  const medico = await service.buscarPorId(req.medico.id)
  if (!medico) return res.status(404).json({ error: 'Médico no encontrado' })
  res.status(200).json(medico)
}

export const buscarPorId = async (req, res) => {
  const medico = await service.buscarPorId(req.params.id)
  if (!medico) return res.status(404).json({ error: 'Médico no encontrado' })
  res.status(200).json(medico)
}

export const pacientes = async (req, res) => {
  // Primero comprobamos que exista el médico solicitado.
  const medico = await service.buscarPorId(req.params.id)
  if (!medico) return res.status(404).json({ error: 'Médico no encontrado' })

  // Si existe pero no tiene pacientes, respondemos con una lista vacía.
  res.status(200).json(await service.pacientesDelMedico(medico._id))
}
