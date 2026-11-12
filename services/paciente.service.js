import { Paciente } from '../models/paciente.model.js'
import { Medico } from '../models/medico.model.js'

export const crear = async (datos, medicoId) => {
  // El médico viene del token. Comprobamos que siga existiendo en la clínica.
  if (!await Medico.exists({ _id: medicoId })) {
    throw Object.assign(new Error('El médico del token ya no existe'), { status: 401 })
  }
  return Paciente.create({ ...datos, medico: medicoId })
}

export const listar = (medicoId, prevision) => {
  // La lista siempre pertenece al médico conectado, incluso si usa un filtro.
  const filtro = { medico: medicoId }
  if (prevision !== undefined) filtro.prevision = prevision
  return Paciente.find(filtro)
}

// Cualquier médico con token puede consultar un paciente por su id.
export const buscarPorId = (id) => Paciente.findById(id)

// Usamos la misma regla antes de editar y antes de eliminar.
const comprobarTratante = (paciente, medicoId) => {
  // Convertimos el ObjectId a texto para comparar su valor con el id del token.
  if (paciente.medico.toString() !== medicoId) {
    throw Object.assign(new Error('Solo el médico tratante puede modificar o eliminar este paciente'), { status: 403 })
  }
}

export const actualizar = async (id, datos, medicoId) => {
  const paciente = await Paciente.findById(id)
  if (!paciente) return null
  comprobarTratante(paciente, medicoId)

  // Solo recibimos los campos permitidos. No cambiamos el médico ni el id.
  paciente.set(datos)
  // save vuelve a revisar los campos obligatorios, fechas y previsión.
  return paciente.save()
}

export const eliminar = async (id, medicoId) => {
  const paciente = await Paciente.findById(id)
  if (!paciente) return null
  comprobarTratante(paciente, medicoId)

  await paciente.deleteOne()
  return paciente
}
