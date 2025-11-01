import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeReviewInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		name: typeof req.body.name === 'string' ? req.body.name.trim() : undefined,
		text: typeof req.body.text === 'string' ? req.body.text.trim() : undefined,
		rating: req.body.rating !== undefined ? Number(req.body.rating) : undefined,
		date: req.body.date !== undefined ? new Date(req.body.date) : undefined,
		user: req.body.user !== undefined ? Number(req.body.user) : undefined,
		product: req.body.product !== undefined ? Number(req.body.product) : undefined,
	}

	Object.keys(req.body.sanitizedInput).forEach(key => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key]
		}
	})

	next()
}

function validateCreateReviewInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	if (!input.name) return HttpResponse.BadRequest(res, 'El nombre es requerido')
	if (!input.text) return HttpResponse.BadRequest(res, 'El texto de la reseña es requerido')
	if (!input.rating) return HttpResponse.BadRequest(res, 'La calificación es requerida')
	if (!input.product) return HttpResponse.BadRequest(res, 'El producto es requerido')

	if (input.name.length < 2) {
		return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
	}
	if (input.name.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
	}

	if (input.text.length < 10) {
		return HttpResponse.BadRequest(res, 'El texto de la reseña debe tener al menos 10 caracteres')
	}
	if (input.text.length > 1000) {
		return HttpResponse.BadRequest(res, 'El texto de la reseña no puede exceder los 1000 caracteres')
	}

	if (isNaN(input.rating) || input.rating < 1 || input.rating > 5) {
		return HttpResponse.BadRequest(res, 'La calificación debe ser un número entre 1 y 5')
	}

	if (input.date && isNaN(input.date.getTime())) {
		return HttpResponse.BadRequest(res, 'La fecha no es válida')
	}

	if (isNaN(input.product) || input.product <= 0) {
		return HttpResponse.BadRequest(res, 'El producto debe ser un ID válido')
	}

	if (input.user !== undefined && (isNaN(input.user) || input.user <= 0)) {
		return HttpResponse.BadRequest(res, 'El usuario debe ser un ID válido')
	}

	next()
}

function validateUpdateReviewInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	if (input.name !== undefined) {
		if (!input.name || input.name.trim() === '') {
			return HttpResponse.BadRequest(res, 'El nombre no puede estar vacío')
		}
		if (input.name.length < 2) {
			return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
		}
		if (input.name.length > 100) {
			return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
		}
	}

	if (input.text !== undefined) {
		if (!input.text || input.text.trim() === '') {
			return HttpResponse.BadRequest(res, 'El texto de la reseña no puede estar vacío')
		}
		if (input.text.length < 10) {
			return HttpResponse.BadRequest(res, 'El texto de la reseña debe tener al menos 10 caracteres')
		}
		if (input.text.length > 1000) {
			return HttpResponse.BadRequest(res, 'El texto de la reseña no puede exceder los 1000 caracteres')
		}
	}

	if (input.rating !== undefined) {
		if (isNaN(input.rating) || input.rating < 1 || input.rating > 5) {
			return HttpResponse.BadRequest(res, 'La calificación debe ser un número entre 1 y 5')
		}
	}

	if (input.date !== undefined && isNaN(input.date.getTime())) {
		return HttpResponse.BadRequest(res, 'La fecha no es válida')
	}

	if (input.product !== undefined && (isNaN(input.product) || input.product <= 0)) {
		return HttpResponse.BadRequest(res, 'El producto debe ser un ID válido')
	}

	if (input.user !== undefined && (isNaN(input.user) || input.user <= 0)) {
		return HttpResponse.BadRequest(res, 'El usuario debe ser un ID válido')
	}

	next()
}

export { 
	sanitizeReviewInput, 
	validateCreateReviewInput, 
	validateUpdateReviewInput 
}