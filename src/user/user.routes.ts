import express from 'express'
import { controllerUser } from './user.controller.js'
import { 
    sanitizeUserInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam,
    validateEmailParam
} from './user.middleware.js'

const router = express.Router()

// Rutas principales
router.get('/', controllerUser.findAll)
router.get('/:id', validateIdParam, controllerUser.findOne)
router.post('/', sanitizeUserInput, validateCreateInput, controllerUser.add)
router.put('/:id', validateIdParam, sanitizeUserInput, validateUpdateInput, controllerUser.update)
router.delete('/:id', validateIdParam, controllerUser.remove)

// Rutas adicionales
router.get('/email/:email', validateEmailParam, controllerUser.findByEmail)
router.get('/localty/:localtyId', controllerUser.findByLocalty)
router.get('/:id/stats', validateIdParam, controllerUser.getStats)
router.get('/:id/ratings/received', validateIdParam, controllerUser.getRatingsReceived)
router.get('/:id/ratings/given', validateIdParam, controllerUser.getRatingsGiven)
router.patch('/:id/increment-sells', validateIdParam, controllerUser.incrementSells)

export default router