import { Router } from 'express'
import { controllerProvince } from './province.controller.js'
import { sanitizeProvinceInput, validateCreateInput, validateUpdateInput } from './province.middleware.js'

export const provinceRouter = Router()

provinceRouter.get('/', controllerProvince.findAll)
provinceRouter.get('/:id', controllerProvince.findOne)
provinceRouter.post('/', sanitizeProvinceInput, validateCreateInput, controllerProvince.add)
provinceRouter.put('/:id', sanitizeProvinceInput, validateUpdateInput, controllerProvince.update)
provinceRouter.delete('/:id', controllerProvince.remove)
