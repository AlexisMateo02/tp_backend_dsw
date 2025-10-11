import { Router } from 'express'
import { controllerKayakType } from './kayakType.controller.js'
import { sanitizeKayakTypeInput, validateCreateInput, validateUpdateInput } from './kayakType.middleware.js'

export const kayakTypeRouter = Router()

kayakTypeRouter.get('/', controllerKayakType.findAll)
kayakTypeRouter.get('/:id', controllerKayakType.findOne)
kayakTypeRouter.post('/', sanitizeKayakTypeInput, validateCreateInput, controllerKayakType.add)
kayakTypeRouter.put('/:id', sanitizeKayakTypeInput, validateUpdateInput, controllerKayakType.update)
kayakTypeRouter.delete('/:id', controllerKayakType.remove)
