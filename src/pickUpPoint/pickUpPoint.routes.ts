import express from 'express'
import { controllerPickUpPoint } from './pickUpPoint.controller.js'
import { 
    sanitizePickUpPointInput, 
    validateCreatePickUpPointInput, 
    validateUpdatePickUpPointInput 
} from './pickUpPoint.middleware.js'

export const pickUpPointRouter = express.Router()

pickUpPointRouter.get('/', controllerPickUpPoint.findAll)
pickUpPointRouter.get('/:id', controllerPickUpPoint.findOne)
pickUpPointRouter.post('/', sanitizePickUpPointInput, validateCreatePickUpPointInput, controllerPickUpPoint.add)
pickUpPointRouter.put('/:id', sanitizePickUpPointInput, validateUpdatePickUpPointInput, controllerPickUpPoint.update)
pickUpPointRouter.delete('/:id', controllerPickUpPoint.remove)