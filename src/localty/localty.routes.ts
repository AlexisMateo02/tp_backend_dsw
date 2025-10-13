import express from 'express'
import { controllerLocalty } from './localty.controller.js'
import { 
    sanitizeLocaltyInput, 
    validateCreateInput, 
    validateUpdateInput 
} from './localty.middleware.js'

export const localtyrouter = express.Router()

localtyrouter.get('/', controllerLocalty.findAll)
localtyrouter.get('/:zipcode', controllerLocalty.findOne)
localtyrouter.post('/', sanitizeLocaltyInput, validateCreateInput, controllerLocalty.add)
localtyrouter.put('/:zipcode', sanitizeLocaltyInput, validateUpdateInput, controllerLocalty.update)
localtyrouter.delete('/:zipcode', controllerLocalty.remove)
