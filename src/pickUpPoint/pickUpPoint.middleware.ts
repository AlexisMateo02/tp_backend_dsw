import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizePickUpPointInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		name: typeof req.body.name === 'string' ? req.body.name.trim() : undefined,
		address: typeof req.body.address === 'string' ? req.body.address.trim() : undefined,
		phone: typeof req.body.phone === 'string' ? req.body.phone.trim().replace(/\s+/g, '') : undefined,
		email: typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : undefined,
		description: typeof req.body.description === 'string' ? req.body.description.trim() : undefined,
		openingHours: typeof req.body.openingHours === 'string' ? req.body.openingHours.trim() : undefined,
		imageUrl: typeof req.body.imageUrl === 'string' ? req.body.imageUrl.trim() : undefined,
		latitude: req.body.latitude !== undefined ? parseFloat(req.body.latitude) : undefined,
		longitude: req.body.longitude !== undefined ? parseFloat(req.body.longitude) : undefined,
		active: req.body.active !== undefined ? Boolean(req.body.active) : undefined,
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
	if (!input.name) return HttpResponse.BadRequest(res, 'El nombre es requerido')
	if (!input.address) return HttpResponse.BadRequest(res, 'La dirección es requerida')
	if (!input.localty) return HttpResponse.BadRequest(res, 'La localidad es requerida')

	// Validar nombre
	if (input.name.length < 2) {
		return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
	}
	if (input.name.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
	}

	// Validar dirección
	if (input.address.length < 5) {
		return HttpResponse.BadRequest(res, 'La dirección debe tener al menos 5 caracteres')
	}
	if (input.address.length > 200) {
		return HttpResponse.BadRequest(res, 'La dirección no puede exceder los 200 caracteres')
	}

	// Validar teléfono si está presente
	if (input.phone && !/^\+?[0-9\s\-\(\)]{10,}$/.test(input.phone)) {
		return HttpResponse.BadRequest(res, 'El teléfono no es válido')
	}

	// Validar email si está presente
	if (input.email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(input.email)) {
			return HttpResponse.BadRequest(res, 'El email no es válido')
		}
	}

	// Validar descripción si está presente
	if (input.description && input.description.length > 500) {
		return HttpResponse.BadRequest(res, 'La descripción no puede exceder los 500 caracteres')
	}

	// Validar horario de apertura si está presente
	if (input.openingHours && input.openingHours.length > 100) {
		return HttpResponse.BadRequest(res, 'El horario de apertura no puede exceder los 100 caracteres')
	}

	// Validar URL de imagen si está presente
	if (input.imageUrl) {
		try {
			new URL(input.imageUrl)
		} catch {
			return HttpResponse.BadRequest(res, 'La URL de la imagen no es válida')
		}
		if (input.imageUrl.length > 500) {
			return HttpResponse.BadRequest(res, 'La URL de la imagen no puede exceder los 500 caracteres')
		}
	}

	// Validar coordenadas si están presentes
	if (input.latitude !== undefined) {
		if (isNaN(input.latitude) || input.latitude < -90 || input.latitude > 90) {
			return HttpResponse.BadRequest(res, 'La latitud debe ser un número entre -90 y 90')
		}
	}

	if (input.longitude !== undefined) {
		if (isNaN(input.longitude) || input.longitude < -180 || input.longitude > 180) {
			return HttpResponse.BadRequest(res, 'La longitud debe ser un número entre -180 y 180')
		}
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

	// Validar nombre si está presente
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

	// Validar teléfono si está presente
	if (input.phone !== undefined && input.phone !== '') {
		if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(input.phone)) {
			return HttpResponse.BadRequest(res, 'El teléfono no es válido')
		}
	}

	// Validar email si está presente
	if (input.email !== undefined && input.email !== '') {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(input.email)) {
			return HttpResponse.BadRequest(res, 'El email no es válido')
		}
	}

	// Validar descripción si está presente
	if (input.description !== undefined && input.description.length > 500) {
		return HttpResponse.BadRequest(res, 'La descripción no puede exceder los 500 caracteres')
	}

	// Validar horario de apertura si está presente
	if (input.openingHours !== undefined && input.openingHours.length > 100) {
		return HttpResponse.BadRequest(res, 'El horario de apertura no puede exceder los 100 caracteres')
	}

	// Validar URL de imagen si está presente
	if (input.imageUrl !== undefined && input.imageUrl !== '') {
		try {
			new URL(input.imageUrl)
		} catch {
			return HttpResponse.BadRequest(res, 'La URL de la imagen no es válida')
		}
		if (input.imageUrl.length > 500) {
			return HttpResponse.BadRequest(res, 'La URL de la imagen no puede exceder los 500 caracteres')
		}
	}

	// Validar coordenadas si están presentes
	if (input.latitude !== undefined) {
		if (isNaN(input.latitude) || input.latitude < -90 || input.latitude > 90) {
			return HttpResponse.BadRequest(res, 'La latitud debe ser un número entre -90 y 90')
		}
	}

	if (input.longitude !== undefined) {
		if (isNaN(input.longitude) || input.longitude < -180 || input.longitude > 180) {
			return HttpResponse.BadRequest(res, 'La longitud debe ser un número entre -180 y 180')
		}
	}

	// Validar localidad si está presente
	if (input.localty !== undefined) {
		if (isNaN(input.localty) || input.localty <= 0) {
			return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
		}
	}

	// Validar active si está presente (debe ser booleano)
	if (input.active !== undefined && typeof input.active !== 'boolean') {
		return HttpResponse.BadRequest(res, 'El campo active debe ser un valor booleano')
	}

	next()
}

export { 
	sanitizePickUpPointInput, 
	validateCreatePickUpPointInput, 
	validateUpdatePickUpPointInput 
}