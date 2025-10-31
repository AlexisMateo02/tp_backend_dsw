import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllReviews,
	getReviewById,
	getReviewsByProduct,
	createReview,
	updateReview,
	deleteReview,
} from './review.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const reviews = await getAllReviews()
		return HttpResponse.Ok(res, 'Todas las reseñas fueron encontradas correctamente', reviews)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar reseñas')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const review = await getReviewById(id)
		return HttpResponse.Ok(res, 'Reseña encontrada correctamente', review)
	} catch (err: any) {
		if (err.message === 'ID de reseña inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar reseña')
	}
}

async function findByProduct(req: Request, res: Response) {
	try {
		const productId = Number.parseInt(req.params.productId)
		const reviews = await getReviewsByProduct(productId)
		return HttpResponse.Ok(res, 'Reseñas del producto encontradas correctamente', reviews)
	} catch (err: any) {
		if (err.message === 'ID de producto inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar reseñas del producto')
	}
}

async function add(req: Request, res: Response) {
	try {
		const reviewData = req.body.sanitizedInput
		const review = await createReview(reviewData)
		return HttpResponse.Created(res, 'Reseña creada correctamente', review)
	} catch (err: any) {
		if (err.message === 'La calificación debe estar entre 1 y 5') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear reseña')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const reviewData = req.body.sanitizedInput
		const review = await updateReview(id, reviewData)
		return HttpResponse.Ok(res, 'Reseña actualizada correctamente', review)
	} catch (err: any) {
		if (err.message === 'ID de reseña inválido' || err.message === 'La calificación debe estar entre 1 y 5') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar reseña')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteReview(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de reseña inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar reseña')
	}
}

export const controllerReview = {
	findAll,
	findOne,
	findByProduct,
	add,
	update,
	remove,
}
