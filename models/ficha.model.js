import mongoose from 'mongoose'

// La ficha es un extra opcional. Por ahora solo corregimos su archivo.
const fichaSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId,
              ref: 'Paciente', required: true },
  medico:   { type: mongoose.Schema.Types.ObjectId,
              ref: 'Medico', required: true },
  diagnostico: { type: String, required: true, trim: true },
  tratamiento: { type: String, trim: true },
  fecha: { type: Date, default: Date.now },
}, { timestamps: true })

export const Ficha = mongoose.model('Ficha', fichaSchema, 'fichas')
