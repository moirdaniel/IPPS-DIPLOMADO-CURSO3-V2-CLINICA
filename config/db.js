import mongoose from 'mongoose'


// La dirección se lee desde .env para no publicarla en el código.
export const conectar = async () => {
    if (!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI en .env')
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    console.log('Conectado a la bd')
}
