import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { PublicationStatus } from './forumPublishment.entity.js'

function sanitizeForumPublishmentInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		title: typeof req.body.title === 'string' ? req.body.title.trim() : undefined,
		content: typeof req.body.content === 'string' ? req.body.content.trim() : undefined,
		contactInfo: typeof req.body.contactInfo === 'string' ? req.body.contactInfo.trim() : undefined,
		authorId: req.body.authorId !== undefined ? Number(req.body.authorId) : undefined,
		images: Array.isArray(req.body.images) ? req.body.images.slice(0, 5) : undefined,
		price: req.body.price !== undefined ? Number(req.body.price) : undefined,
		status: req.body.status as PublicationStatus,
	}

	Object.keys(req.body.sanitizedInput).forEach(key => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key]
		}
	})

	next()
}

function validateCreateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	if (!input.title) return HttpResponse.BadRequest(res, 'El título es requerido')
	if (!input.content) return HttpResponse.BadRequest(res, 'El contenido es requerido')
	if (!input.contactInfo) return HttpResponse.BadRequest(res, 'La información de contacto es requerida')
	if (!input.authorId) return HttpResponse.BadRequest(res, 'El autor es requerido')

	if (input.title.length < 3) {
		return HttpResponse.BadRequest(res, 'El título debe tener al menos 3 caracteres')
	}
	if (input.title.length > 200) {
		return HttpResponse.BadRequest(res, 'El título no puede exceder los 200 caracteres')
	}

	if (input.content.length < 10) {
		return HttpResponse.BadRequest(res, 'El contenido debe tener al menos 10 caracteres')
	}
	if (input.content.length > 5000) {
		return HttpResponse.BadRequest(res, 'El contenido no puede exceder los 5000 caracteres')
	}

	if (input.contactInfo.length < 3) {
		return HttpResponse.BadRequest(res, 'La información de contacto debe tener al menos 3 caracteres')
	}
	if (input.contactInfo.length > 500) {
		return HttpResponse.BadRequest(res, 'La información de contacto no puede exceder los 500 caracteres')
	}

	if (isNaN(input.authorId) || input.authorId <= 0) {
		return HttpResponse.BadRequest(res, 'El autor debe ser un ID válido')
	}

	if (input.images && input.images.length > 5) {
		return HttpResponse.BadRequest(res, 'Máximo 5 imágenes permitidas')
	}

	if (input.price !== undefined && (isNaN(input.price) || input.price < 0)) {
		return HttpResponse.BadRequest(res, 'El precio debe ser un número positivo')
	}

	if (input.status && !Object.values(PublicationStatus).includes(input.status)) {
		return HttpResponse.BadRequest(res, 'El estado de la publicación no es válido')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	if (input.title !== undefined) {
		if (!input.title || input.title.trim() === '') {
			return HttpResponse.BadRequest(res, 'El título no puede estar vacío')
		}
		if (input.title.length < 3) {
			return HttpResponse.BadRequest(res, 'El título debe tener al menos 3 caracteres')
		}
		if (input.title.length > 200) {
			return HttpResponse.BadRequest(res, 'El título no puede exceder los 200 caracteres')
		}
	}

	if (input.content !== undefined) {
		if (!input.content || input.content.trim() === '') {
			return HttpResponse.BadRequest(res, 'El contenido no puede estar vacío')
		}
		if (input.content.length < 10) {
			return HttpResponse.BadRequest(res, 'El contenido debe tener al menos 10 caracteres')
		}
		if (input.content.length > 5000) {
			return HttpResponse.BadRequest(res, 'El contenido no puede exceder los 5000 caracteres')
		}
	}

	if (input.contactInfo !== undefined) {
		if (!input.contactInfo || input.contactInfo.trim() === '') {
			return HttpResponse.BadRequest(res, 'La información de contacto no puede estar vacía')
		}
		if (input.contactInfo.length < 3) {
			return HttpResponse.BadRequest(res, 'La información de contacto debe tener al menos 3 caracteres')
		}
		if (input.contactInfo.length > 500) {
			return HttpResponse.BadRequest(res, 'La información de contacto no puede exceder los 500 caracteres')
		}
	}

	if (input.authorId !== undefined) {
		if (isNaN(input.authorId) || input.authorId <= 0) {
			return HttpResponse.BadRequest(res, 'El autor debe ser un ID válido')
		}
	}

	if (input.images && input.images.length > 5) {
		return HttpResponse.BadRequest(res, 'Máximo 5 imágenes permitidas')
	}

	if (input.price !== undefined && (isNaN(input.price) || input.price < 0)) {
		return HttpResponse.BadRequest(res, 'El precio debe ser un número positivo')
	}

	if (input.status && !Object.values(PublicationStatus).includes(input.status)) {
		return HttpResponse.BadRequest(res, 'El estado de la publicación no es válido')
	}

	next()
}

export { sanitizeForumPublishmentInput, validateCreateInput, validateUpdateInput }
