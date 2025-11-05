import express from 'express'
import { controllerForumPublishment } from './forumPublishment.controller.js'
import { 
    sanitizeForumPublishmentInput, 
    validateCreateInput, 
    validateUpdateInput 
} from './forumPublishment.middleware.js'

export const forumPublishmentRouter = express.Router()

// RUTAS PARA LISTADOS FILTRADOS
forumPublishmentRouter.get('/', controllerForumPublishment.findAll)
forumPublishmentRouter.get('/active', controllerForumPublishment.findActive)
forumPublishmentRouter.get('/sold', controllerForumPublishment.findSold)
forumPublishmentRouter.get('/status/:status', controllerForumPublishment.findByStatus)

// RUTAS CRUD BÁSICAS
forumPublishmentRouter.get('/:id', controllerForumPublishment.findOne)
forumPublishmentRouter.post('/', sanitizeForumPublishmentInput, validateCreateInput, controllerForumPublishment.add)
forumPublishmentRouter.put('/:id', sanitizeForumPublishmentInput, validateUpdateInput, controllerForumPublishment.update)
forumPublishmentRouter.delete('/:id', controllerForumPublishment.remove)