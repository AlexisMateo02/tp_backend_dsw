import express from 'express'
import { controllerReview } from './review.controller.js'
import { 
    sanitizeReviewInput, 
    validateCreateReviewInput, 
    validateUpdateReviewInput 
} from './review.middleware.js'

export const reviewRouter = express.Router()

reviewRouter.get('/', controllerReview.findAll)
reviewRouter.get('/:id', controllerReview.findOne)
reviewRouter.post('/', sanitizeReviewInput, validateCreateReviewInput, controllerReview.add)
reviewRouter.put('/:id', sanitizeReviewInput, validateUpdateReviewInput, controllerReview.update)
reviewRouter.delete('/:id', controllerReview.remove)