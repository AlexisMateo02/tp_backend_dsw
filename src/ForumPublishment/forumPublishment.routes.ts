import express from 'express'
import { controllerForumPublishment } from './forumPublishment.controller.js'
import {
	sanitizeForumPublishmentInput,
	validateCreateInput,
	validateUpdateInput,
} from './forumPublishment.middleware.js'
import { authenticate, requireCustomer } from '../auth/auth.middleware.js'
import { uploadMiddleware } from '../shared/middlewares/upload.middleware.js'

export const forumPublishmentRouter = express.Router()

// RUTAS PÚBLICAS (sin autenticación)
forumPublishmentRouter.get('/', controllerForumPublishment.findAll)
forumPublishmentRouter.get('/active', controllerForumPublishment.findActive)
forumPublishmentRouter.get('/sold', controllerForumPublishment.findSold)
forumPublishmentRouter.get('/status/:status', controllerForumPublishment.findByStatus)
forumPublishmentRouter.get('/:id', controllerForumPublishment.findOne)

// RUTAS PROTEGIDAS (requieren autenticación)
forumPublishmentRouter.post(
	'/',
	authenticate,
	requireCustomer,
	sanitizeForumPublishmentInput,
	validateCreateInput,
	controllerForumPublishment.add
)

forumPublishmentRouter.put(
	'/:id',
	authenticate,
	requireCustomer,
	sanitizeForumPublishmentInput,
	validateUpdateInput,
	controllerForumPublishment.update
)

forumPublishmentRouter.delete('/:id', authenticate, requireCustomer, controllerForumPublishment.remove)

forumPublishmentRouter.post(
	'/upload-image',
	authenticate,
	requireCustomer,
	uploadMiddleware.single('image'),
	controllerForumPublishment.uploadImage
)
