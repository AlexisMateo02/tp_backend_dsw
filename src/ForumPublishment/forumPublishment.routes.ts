import express from 'express'
import { controllerForumPublishment } from './forumPublishment.controller.js'
import { 
    sanitizeForumPublishmentInput, 
    validateCreateInput, 
    validateUpdateInput 
} from './forumPublishment.middleware.js'

export const forumPublishmentRouter = express.Router()

forumPublishmentRouter.get('/', controllerForumPublishment.findAll)
forumPublishmentRouter.get('/:id', controllerForumPublishment.findOne)
forumPublishmentRouter.post('/', sanitizeForumPublishmentInput, validateCreateInput, controllerForumPublishment.add)
forumPublishmentRouter.put('/:id', sanitizeForumPublishmentInput, validateUpdateInput, controllerForumPublishment.update)
forumPublishmentRouter.delete('/:id', controllerForumPublishment.remove)