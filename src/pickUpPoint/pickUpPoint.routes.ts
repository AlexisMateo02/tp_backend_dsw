import express from 'express'
import { controllerPickUpPoint } from './pickUpPoint.controller.js'
import { 
    sanitizePickUpPointInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam 
} from './pickUpPoint.middleware.js'

const pickUpPointrouter = express.Router()

pickUpPointrouter.get('/', controllerPickUpPoint.findAll)
pickUpPointrouter.get('/:id', validateIdParam, controllerPickUpPoint.findOne)
pickUpPointrouter.post('/', sanitizePickUpPointInput, validateCreateInput, controllerPickUpPoint.add)
pickUpPointrouter.put('/:id', validateIdParam, sanitizePickUpPointInput, validateUpdateInput, controllerPickUpPoint.update)
pickUpPointrouter.delete('/:id', validateIdParam, controllerPickUpPoint.remove)
