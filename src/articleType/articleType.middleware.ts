import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeArticleTypeInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		name: typeof req.body.name === 'string' ? req.body.name.trim().toUpperCase() : undefined,
		mainUse: typeof req.body.mainUse === 'string' ? req.body.mainUse.trim() : undefined,
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

	if (!input.name) return HttpResponse.BadRequest(res, 'El nombre es requerido')
	if (!input.mainUse) return HttpResponse.BadRequest(res, 'El uso principal es requerido')

	if (input.name.length < 2) {
		return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
	}
	if (input.name.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
	}

	if (input.mainUse.length < 3) {
		return HttpResponse.BadRequest(res, 'El uso principal debe tener al menos 3 caracteres')
	}
	if (input.mainUse.length > 255) {
		return HttpResponse.BadRequest(res, 'El uso principal no puede exceder los 255 caracteres')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
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

	if (input.mainUse !== undefined) {
		if (!input.mainUse || input.mainUse.trim() === '') {
			return HttpResponse.BadRequest(res, 'El uso principal no puede estar vacío')
		}
		if (input.mainUse.length < 3) {
			return HttpResponse.BadRequest(res, 'El uso principal debe tener al menos 3 caracteres')
		}
		if (input.mainUse.length > 255) {
			return HttpResponse.BadRequest(res, 'El uso principal no puede exceder los 255 caracteres')
		}
	}

	next()
}

export { sanitizeArticleTypeInput, validateCreateInput, validateUpdateInput }
