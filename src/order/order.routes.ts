import express from 'express'
import { controllerOrder } from './order.controller.js'
import { 
    sanitizeOrderInput, 
    validateCreateOrderInput, 
    validateUpdateOrderInput,
    validateUpdateStatusInput 
} from './order.middleware.js'

export const orderRouter = express.Router()

// GET todas las órdenes
orderRouter.get('/', controllerOrder.findAll)
orderRouter.get('/:id', controllerOrder.findOne)
orderRouter.get('/user/:userId', controllerOrder.findByUser)
orderRouter.post('/', sanitizeOrderInput, validateCreateOrderInput, controllerOrder.add)
orderRouter.patch('/:id/status', sanitizeOrderInput, validateUpdateStatusInput, controllerOrder.updateStatus)
orderRouter.put('/:id', sanitizeOrderInput, validateUpdateOrderInput, controllerOrder.updateStatus)
orderRouter.delete('/:id', controllerOrder.remove)