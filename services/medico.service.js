import { Medico } from '../models/medico.model.js'
import { Paciente } from '../models/paciente.model.js'

// Si no hay especialidad, buscamos todos. Si viene, la usamos como filtro.
export const listar = (especialidad) => {
  const filtro = especialidad === undefined ? {} : { especialidad }
  return Medico.find(filtro)
}

export const buscarPorId = (id) => Medico.findById(id)

// Los pacientes guardan el id del médico en el campo medico.
export const pacientesDelMedico = (id) => Paciente.find({ medico: id })
