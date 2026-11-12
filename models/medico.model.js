import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const medicoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  especialidad: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
}, { timestamps: true })

// Antes de guardar, cambiamos la contraseña por un hash.
medicoSchema.pre('save', async function () {
  // Si solo cambió otro dato, no volvemos a transformar la contraseña.
  if (!this.isModified('password')) return

  this.password = await bcrypt.hash(this.password, 10)
})

// Comparamos la contraseña escrita con el hash guardado.
medicoSchema.methods.compararPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password)
}

// Quitamos la contraseña antes de enviar el médico como JSON.
medicoSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}
export const Medico = mongoose.model(
    'Medico',
    medicoSchema,
    'medicos'
)
