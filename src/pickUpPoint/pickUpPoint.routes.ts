import express from 'express'
import { controllerPickUpPoint } from './pickUpPoint.controller.js'
import {
	sanitizePickUpPointInput,
	validateCreateInput,
	validateUpdateInput,
	validateIdParam,
} from './pickUpPoint.middleware.js'

export const pickUpPointRouter = express.Router()

pickUpPointRouter.get('/', controllerPickUpPoint.findAll)
pickUpPointRouter.get('/localty/:zipcode', controllerPickUpPoint.findByLocalty)
pickUpPointRouter.get('/province/:provinceId', controllerPickUpPoint.findByProvince)
pickUpPointRouter.get('/:id', validateIdParam, controllerPickUpPoint.findOne)
pickUpPointRouter.post('/', sanitizePickUpPointInput, validateCreateInput, controllerPickUpPoint.add)
pickUpPointRouter.put(
	'/:id',
	validateIdParam,
	sanitizePickUpPointInput,
	validateUpdateInput,
	controllerPickUpPoint.update
)
pickUpPointRouter.delete('/:id', validateIdParam, controllerPickUpPoint.remove)
