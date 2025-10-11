import { Router } from 'express'
import { controllerArticleType } from './articleType.controller.js'
import { sanitizeArticleTypeInput, validateCreateInput, validateUpdateInput } from './articleType.middleware.js'

export const articleTypeRouter = Router()

articleTypeRouter.get('/', controllerArticleType.findAll)
articleTypeRouter.get('/:id', controllerArticleType.findOne)
articleTypeRouter.post('/', sanitizeArticleTypeInput, validateCreateInput, controllerArticleType.add)
articleTypeRouter.put('/:id', sanitizeArticleTypeInput, validateUpdateInput, controllerArticleType.update)
articleTypeRouter.delete('/:id', controllerArticleType.remove)
