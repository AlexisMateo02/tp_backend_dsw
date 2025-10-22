import express from 'express'
import { controllerProduct } from './product.controller.js'
import {
	sanitizeProductInput,
	validateCreateInput,
	validateUpdateInput,
	validateIdParam,
	validatePublishmentIdParam,
	validateArticleTypeIdParam,
	validateKayakTypeIdParam,
} from './product.middleware.js'

export const productRouter = express.Router()

productRouter.get('/', controllerProduct.findAll)
productRouter.get('/publishment/:publishmentId', validatePublishmentIdParam, controllerProduct.findByPublishment)
productRouter.get('/articletype/:articleTypeId', validateArticleTypeIdParam, controllerProduct.findByArticleType)
productRouter.get('/kayaktype/:kayakTypeId', validateKayakTypeIdParam, controllerProduct.findByKayakType)
productRouter.get('/:id', validateIdParam, controllerProduct.findOne)
productRouter.post('/', sanitizeProductInput, validateCreateInput, controllerProduct.add)
productRouter.put('/:id', validateIdParam, sanitizeProductInput, validateUpdateInput, controllerProduct.update)
productRouter.delete('/:id', validateIdParam, controllerProduct.remove)
