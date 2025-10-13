import express from 'express'
import { controllerProduct } from './product.controller.js'
import { 
    sanitizeProductInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam 
} from './product.middleware.js'

const productrouter = express.Router()

// Rutas principales
productrouter.get('/', controllerProduct.findAll)
productrouter.get('/:id', validateIdParam, controllerProduct.findOne)
productrouter.post('/', sanitizeProductInput, validateCreateInput, controllerProduct.add)
productrouter.put('/:id', validateIdParam, sanitizeProductInput, validateUpdateInput, controllerProduct.update)
productrouter.delete('/:id', validateIdParam, controllerProduct.remove)

// Rutas adicionales
productrouter.get('/publishment/:publishmentId', validateIdParam, controllerProduct.findByPublishment)
productrouter.get('/articletype/:articleTypeId', validateIdParam, controllerProduct.findByArticleType)
productrouter.get('/kayaktype/:kayakTypeId', validateIdParam, controllerProduct.findByKayakType)

