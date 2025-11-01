import { Router } from 'express'
import { controllerSUPType } from './supType.controller.js'
import { sanitizeSUPTypeInput, validateCreateInput, validateUpdateInput } from './supType.middleware.js'

export const supTypeRouter = Router()

supTypeRouter.get('/', controllerSUPType.findAll)
supTypeRouter.get('/:id', controllerSUPType.findOne)
supTypeRouter.post('/', sanitizeSUPTypeInput, validateCreateInput, controllerSUPType.add)
supTypeRouter.put('/:id', sanitizeSUPTypeInput, validateUpdateInput, controllerSUPType.update)
supTypeRouter.delete('/:id', controllerSUPType.remove)