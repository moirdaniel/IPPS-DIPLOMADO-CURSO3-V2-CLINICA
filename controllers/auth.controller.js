

import * as service from '../services/auth.service.js'

export const registrar = async ( req, res ) =>{
    // Pasamos los datos al servicio para registrar al médico.
     const datos = req.body

     const medico = await service.registrar( datos )

     // Enviamos una respuesta para no dejar al cliente esperando.
     return res.status(201).json(medico)
}

export const login = async (req, res)=>{
    // Completaremos el login y sus validaciones en la Parte 2.
    res.status(501).json({ error: 'Login pendiente de implementar en la Parte 2' })
}
