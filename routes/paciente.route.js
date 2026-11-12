import { Router } from "express"
import { proteger } from "../middlewares/proteger.js"

export const pacienteRoutes = Router()

// Todas las rutas que vienen después necesitan token.
// Las respuestas de práctica se reemplazarán por el CRUD en la Parte 3.
pacienteRoutes.use(proteger)

pacienteRoutes.post('/', (req, res, next)=>{
    res.json({mensaje: 'Pudiste pasar, eres un dctr'})
})
pacienteRoutes.get('/', (req, res, next)=>{
    res.json({mensaje: 'Pudiste pasar, eres un dctr'})
})
pacienteRoutes.get('/:id', (req, res, next)=>{
    res.json({mensaje: 'Pudiste pasar, eres un dctr'})
})
