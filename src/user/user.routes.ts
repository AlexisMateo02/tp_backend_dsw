import express from 'express'
import { controllerUser } from './user.controller.js'
import { sanitizeUserInput, validateCreateInput, validateUpdateInput, validateSellerRegistration } from './user.middleware.js'
import { authenticate, requireAdmin } from '../auth/auth.middleware.js'

export const userRouter = express.Router()

userRouter.post('/register', sanitizeUserInput, validateCreateInput, controllerUser.register)
userRouter.post('/register-seller', sanitizeUserInput, validateCreateInput, validateSellerRegistration, controllerUser.registerAsSellerHandler)
userRouter.get('/', authenticate, requireAdmin, controllerUser.findAll)
userRouter.get('/:id', authenticate, requireAdmin, controllerUser.findOne)
userRouter.put('/:id/verify', authenticate, requireAdmin, controllerUser.verify)
userRouter.delete('/:id', authenticate, requireAdmin, controllerUser.remove)
userRouter.put('/:id', authenticate, sanitizeUserInput, validateUpdateInput, controllerUser.update)
userRouter.get('/email/:email', controllerUser.findByEmail)