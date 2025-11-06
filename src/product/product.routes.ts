import { Router } from 'express'
import { controllerProduct } from './product.controller.js'
import { 
    sanitizeProductInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam,
    validateCategoryParam
} from './product.middleware.js'

export const productRouter = Router()

// Rutas de consulta
productRouter.get('/', controllerProduct.findAll)
productRouter.get('/approved', controllerProduct.findApproved)
productRouter.get('/pending', controllerProduct.findPending)
productRouter.get('/category/:category', validateCategoryParam, controllerProduct.findByCategory)
productRouter.get('/:id', validateIdParam, controllerProduct.findOne)

// Rutas de modificación
productRouter.post('/', sanitizeProductInput, validateCreateInput, controllerProduct.add)
productRouter.put('/:id', validateIdParam, sanitizeProductInput, validateUpdateInput, controllerProduct.update)
productRouter.patch('/:id/approve', validateIdParam, controllerProduct.approve)
productRouter.delete('/:id', validateIdParam, controllerProduct.remove)