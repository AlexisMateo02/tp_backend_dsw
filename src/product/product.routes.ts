import express from 'express'
import { controllerProduct } from './product.controller.js'
import { 
    sanitizeProductInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam 
} from './product.middleware.js'

export const productRouter = express.Router()

// Rutas principales
productRouter.get('/', controllerProduct.findAll)
productRouter.get('/:id', validateIdParam, controllerProduct.findOne)
productRouter.post('/', sanitizeProductInput, validateCreateInput, controllerProduct.add)
productRouter.put('/:id', validateIdParam, sanitizeProductInput, validateUpdateInput, controllerProduct.update)
productRouter.delete('/:id', validateIdParam, controllerProduct.remove)

// Rutas adicionales
productRouter.get('/publishment/:publishmentId', validateIdParam, controllerProduct.findByPublishment)
productRouter.get('/articletype/:articleTypeId', validateIdParam, controllerProduct.findByArticleType)
productRouter.get('/kayaktype/:kayakTypeId', validateIdParam, controllerProduct.findByKayakType)

