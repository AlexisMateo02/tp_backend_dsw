import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizePickUpPointInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		storeName: typeof req.body.storeName === 'string' ? req.body.storeName.trim() : undefined,
		address: typeof req.body.address === 'string' ? req.body.address.trim() : undefined,
		adressDescription: typeof req.body.adressDescription === 'string' ? req.body.adressDescription.trim() : undefined,
		phoneNumber: typeof req.body.phoneNumber === 'string' ? req.body.phoneNumber.trim() : undefined,
		horary: typeof req.body.horary === 'string' ? req.body.horary.trim() : undefined,
		localty: req.body.localty !== undefined ? Number(req.body.localty) : undefined,
	}

	// Eliminar campos undefined
	Object.keys(req.body.sanitizedInput).forEach(key => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key]
		}
	})

	next()
}

function validateCreatePickUpPointInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	// Campos obligatorios
	if (!input.address) return HttpResponse.BadRequest(res, 'La dirección es requerida')
	if (!input.localty) return HttpResponse.BadRequest(res, 'La localidad es requerida')

	// Validar storeName si está presente
	if (input.storeName && input.storeName.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre de la tienda no puede exceder los 100 caracteres')
	}

	// Validar dirección
	if (input.address.length < 5) {
		return HttpResponse.BadRequest(res, 'La dirección debe tener al menos 5 caracteres')
	}
	if (input.address.length > 200) {
		return HttpResponse.BadRequest(res, 'La dirección no puede exceder los 200 caracteres')
	}

	// Validar descripción de dirección si está presente
	if (input.adressDescription && input.adressDescription.length > 500) {
		return HttpResponse.BadRequest(res, 'La descripción de dirección no puede exceder los 500 caracteres')
	}

	// Validar phoneNumber si está presente
	if (input.phoneNumber && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(input.phoneNumber)) {
		return HttpResponse.BadRequest(res, 'El número de teléfono no tiene un formato válido')
	}

	// Validar horary si está presente (longitud máxima)
	if (input.horary && input.horary.length > 100) {
		return HttpResponse.BadRequest(res, 'El horario no puede exceder los 100 caracteres')
	}

	// Validar localidad (ID)
	if (isNaN(input.localty) || input.localty <= 0) {
		return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
	}

	next()
}

function validateUpdatePickUpPointInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	// Validar storeName si está presente
	if (input.storeName !== undefined && input.storeName !== '' && input.storeName.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre de la tienda no puede exceder los 100 caracteres')
	}

	// Validar dirección si está presente
	if (input.address !== undefined) {
		if (!input.address || input.address.trim() === '') {
			return HttpResponse.BadRequest(res, 'La dirección no puede estar vacía')
		}
		if (input.address.length < 5) {
			return HttpResponse.BadRequest(res, 'La dirección debe tener al menos 5 caracteres')
		}
		if (input.address.length > 200) {
			return HttpResponse.BadRequest(res, 'La dirección no puede exceder los 200 caracteres')
		}
	}

	// Validar descripción de dirección si está presente
	if (input.adressDescription !== undefined && input.adressDescription.length > 500) {
		return HttpResponse.BadRequest(res, 'La descripción de dirección no puede exceder los 500 caracteres')
	}

	// Validar phoneNumber si está presente
	if (input.phoneNumber !== undefined && input.phoneNumber !== '') {
		if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(input.phoneNumber)) {
			return HttpResponse.BadRequest(res, 'El número de teléfono no tiene un formato válido')
		}
	}

	// Validar horary si está presente
	if (input.horary !== undefined && input.horary.length > 100) {
		return HttpResponse.BadRequest(res, 'El horario no puede exceder los 100 caracteres')
	}

	// Validar localidad si está presente
	if (input.localty !== undefined) {
		if (isNaN(input.localty) || input.localty <= 0) {
			return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
		}
	}

	next()
}

export { 
	sanitizePickUpPointInput, 
	validateCreatePickUpPointInput, 
	validateUpdatePickUpPointInput 
}