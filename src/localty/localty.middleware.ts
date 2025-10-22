import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeLocaltyInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		zipcode: typeof req.body.zipcode === 'string' ? req.body.zipcode.trim().replace(/\s+/g, '') : undefined,
		name: typeof req.body.name === 'string' ? req.body.name.trim().toUpperCase() : undefined,
		province: req.body.province !== undefined ? Number(req.body.province) : undefined,
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

	if (!input.zipcode) return HttpResponse.BadRequest(res, 'El código postal es requerido')
	if (!input.name) return HttpResponse.BadRequest(res, 'El nombre es requerido')
	if (!input.province) return HttpResponse.BadRequest(res, 'La provincia es requerida')

	// Validación completa del zipcode (según validationZipCode.ts)
	if (!input.zipcode || input.zipcode.trim().length === 0) {
		return HttpResponse.BadRequest(res, 'El código postal es requerido')
	}
	const zipCodeRegex = /^[0-9]{4,5}$/
	if (!zipCodeRegex.test(input.zipcode)) {
		return HttpResponse.BadRequest(res, 'El código postal debe contener entre 4 y 5 dígitos numéricos')
	}

	// Validaciones para name
	if (input.name.length < 2) {
		return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
	}
	if (input.name.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
	}

	// Validaciones para province (ID)
	if (isNaN(input.province) || input.province <= 0) {
		return HttpResponse.BadRequest(res, 'La provincia debe ser un ID válido')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	if (input.zipcode !== undefined) {
		// Validación completa del zipcode (según validationZipCode.ts)
		if (!input.zipcode || input.zipcode.trim().length === 0) {
			return HttpResponse.BadRequest(res, 'El código postal es requerido')
		}
		const zipCodeRegex = /^[0-9]{4,5}$/
		if (!zipCodeRegex.test(input.zipcode)) {
			return HttpResponse.BadRequest(res, 'El código postal debe contener entre 4 y 5 dígitos numéricos')
		}
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

	if (input.province !== undefined) {
		if (isNaN(input.province) || input.province <= 0) {
			return HttpResponse.BadRequest(res, 'La provincia debe ser un ID válido')
		}
	}

	next()
}

export { sanitizeLocaltyInput, validateCreateInput, validateUpdateInput }