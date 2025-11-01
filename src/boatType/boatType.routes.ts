import { Router } from 'express'
import { controllerBoatType } from './boatType.controller.js'
import { sanitizeBoatTypeInput, validateCreateInput, validateUpdateInput } from './boatType.middleware.js'

export const boatTypeRouter = Router()

boatTypeRouter.get('/', controllerBoatType.findAll)
boatTypeRouter.get('/:id', controllerBoatType.findOne)
boatTypeRouter.post('/', sanitizeBoatTypeInput, validateCreateInput, controllerBoatType.add)
boatTypeRouter.put('/:id', sanitizeBoatTypeInput, validateUpdateInput, controllerBoatType.update)
boatTypeRouter.delete('/:id', controllerBoatType.remove)