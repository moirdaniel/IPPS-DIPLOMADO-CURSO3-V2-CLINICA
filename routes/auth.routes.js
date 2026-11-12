import { Router } from "express"

import * as controller from '../controllers/auth.controller.js'

// Exportamos este grupo de rutas para usarlo desde server.js.
export const authRoutes = Router()


authRoutes.post('/registro', controller.registrar)

authRoutes.post('/login', controller.login)
