import mongoose from 'mongoose'

// El esquema indica qué datos guardamos de cada paciente y cuáles son obligatorios.
const pacienteSchema = new mongoose.Schema({
  // Quitamos los espacios que sobren al principio y al final del nombre.
  nombre: { type: String, required: true, trim: true },

  // El RUT es obligatorio y no puede repetirse entre los pacientes.
  rut: { type: String, required: true, unique: true },

  // Guardamos la fecha como un dato de tipo Date, no como un texto cualquiera.
  fechaNacimiento: { type: Date, required: true },

  // Solo aceptamos estas tres previsiones. Si no envían una, usamos Fonasa.
  prevision: {
    type: String,
    enum: ['Fonasa', 'Isapre', 'Particular'],
    default: 'Fonasa'
  },

  // Estos datos son opcionales. El email se guarda en minúsculas.
  telefono: { type: String },
  email: { type: String, lowercase: true },

  // Guardamos el _id del médico tratante, no una copia de todos sus datos.
  // ref señala que ese id corresponde al modelo Medico.
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medico',
    required: true
  }
}, {
  // Agregamos la fecha de creación y la de la última actualización.
  timestamps: true
})

// Exportamos el modelo y usamos la colección llamada pacientes.
export const Paciente = mongoose.model('Paciente', pacienteSchema, 'pacientes')
