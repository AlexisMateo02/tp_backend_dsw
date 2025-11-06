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
orderRouter.get('/pickup-point/:pickUpPointId', controllerOrder.findByPickUpPoint)

// Crear nueva orden
orderRouter.post('/', sanitizeOrderInput, validateCreateOrderInput, controllerOrder.add)

// Actualizar orden (status y notes)
orderRouter.put('/:id', sanitizeOrderInput, validateUpdateOrderInput, controllerOrder.update)

// Actualizar solo el estado de la orden
orderRouter.patch('/:id/status', sanitizeOrderInput, validateUpdateStatusInput, controllerOrder.updateStatus)

// Eliminar orden
orderRouter.delete('/:id', controllerOrder.remove)