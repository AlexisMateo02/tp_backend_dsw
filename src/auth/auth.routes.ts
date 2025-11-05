import express from 'express'
import { loginHandler, getProfile } from './auth.controller.js'
import { authenticate } from './auth.middleware.js'

export const authRouter = express.Router()

// Rutas públicas
authRouter.post('/login', loginHandler)

// Rutas protegidas
authRouter.get('/profile', authenticate, getProfile)