import { Router } from 'express'
import { proteger } from '../middlewares/proteger.js'
import { validarObjectId } from '../middlewares/validarObjectId.js'
import * as controller from '../controllers/medico.controller.js'

export const medicoRoutes = Router()

// Todas las rutas de médicos necesitan un token válido.
medicoRoutes.use(proteger)

medicoRoutes.get('/', controller.listar)
// Declaramos perfil antes de :id para que no lo confunda con un id.
medicoRoutes.get('/perfil', controller.perfil)
medicoRoutes.get('/:id/pacientes', validarObjectId, controller.pacientes)
medicoRoutes.get('/:id', validarObjectId, controller.buscarPorId)
