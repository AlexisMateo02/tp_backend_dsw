import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeProvinceInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		name: typeof req.body.name === 'string' ? req.body.name.trim().toUpperCase() : undefined,
		country: typeof req.body.country === 'string' ? req.body.country.trim().toUpperCase() : undefined,
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
	if (!input.country) return HttpResponse.BadRequest(res, 'El país es requerido')

	if (input.name.length < 2) {
		return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
	}
	if (input.name.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
	}

	if (input.country.length < 2) {
		return HttpResponse.BadRequest(res, 'El país debe tener al menos 2 caracteres')
	}
	if (input.country.length > 100) {
		return HttpResponse.BadRequest(res, 'El país no puede exceder los 100 caracteres')
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

	if (input.country !== undefined) {
		if (!input.country || input.country.trim() === '') {
			return HttpResponse.BadRequest(res, 'El país no puede estar vacío')
		}
		if (input.country.length < 2) {
			return HttpResponse.BadRequest(res, 'El país debe tener al menos 2 caracteres')
		}
		if (input.country.length > 100) {
			return HttpResponse.BadRequest(res, 'El país no puede exceder los 100 caracteres')
		}
	}

	next()
}

export { sanitizeProvinceInput, validateCreateInput, validateUpdateInput }
