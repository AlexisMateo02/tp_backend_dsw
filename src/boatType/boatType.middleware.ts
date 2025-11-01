import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeBoatTypeInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		model: typeof req.body.model === 'string' ? req.body.model.trim() : undefined,
		brand: typeof req.body.brand === 'string' ? req.body.brand.trim() : undefined,
		boatCategory: typeof req.body.boatCategory === 'string' ? req.body.boatCategory.trim() : undefined,
		material: typeof req.body.material === 'string' ? req.body.material.trim() : undefined,
		passengerCapacity:
			typeof req.body.passengerCapacity === 'number'
				? req.body.passengerCapacity
				: typeof req.body.passengerCapacity === 'string'
					? Number.parseInt(req.body.passengerCapacity)
					: undefined,
		maxWeightCapacity:
			typeof req.body.maxWeightCapacity === 'number'
				? req.body.maxWeightCapacity
				: typeof req.body.maxWeightCapacity === 'string'
					? Number.parseFloat(req.body.maxWeightCapacity)
					: undefined,
		length:
			typeof req.body.length === 'number'
				? req.body.length
				: typeof req.body.length === 'string'
					? Number.parseFloat(req.body.length)
					: undefined,
		beam:
			typeof req.body.beam === 'number'
				? req.body.beam
				: typeof req.body.beam === 'string'
					? Number.parseFloat(req.body.beam)
					: undefined,
		hullType: typeof req.body.hullType === 'string' ? req.body.hullType.trim() : undefined,
		motorType: typeof req.body.motorType === 'string' ? req.body.motorType.trim() : undefined,
		maxHorsePower:
			typeof req.body.maxHorsePower === 'number'
				? req.body.maxHorsePower
				: typeof req.body.maxHorsePower === 'string'
					? Number.parseInt(req.body.maxHorsePower)
					: undefined,
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

	// Validar campos requeridos
	if (!input.model) return HttpResponse.BadRequest(res, 'El modelo es requerido')
	if (!input.brand) return HttpResponse.BadRequest(res, 'La marca es requerida')
	if (!input.boatCategory) return HttpResponse.BadRequest(res, 'La categoría de embarcación es requerida')
	if (!input.material) return HttpResponse.BadRequest(res, 'El material es requerido')
	if (input.passengerCapacity === undefined) return HttpResponse.BadRequest(res, 'La capacidad de pasajeros es requerida')
	if (input.maxWeightCapacity === undefined) return HttpResponse.BadRequest(res, 'La capacidad máxima de peso es requerida')
	if (input.length === undefined) return HttpResponse.BadRequest(res, 'La longitud es requerida')
	if (input.beam === undefined) return HttpResponse.BadRequest(res, 'La manga es requerida')
	if (!input.hullType) return HttpResponse.BadRequest(res, 'El tipo de casco es requerido')

	// Validaciones para model
	if (input.model.length < 2) return HttpResponse.BadRequest(res, 'El modelo debe tener al menos 2 caracteres')
	if (input.model.length > 100) return HttpResponse.BadRequest(res, 'El modelo no puede exceder los 100 caracteres')

	// Validaciones para brand
	if (input.brand.length < 2) return HttpResponse.BadRequest(res, 'La marca debe tener al menos 2 caracteres')
	if (input.brand.length > 100) return HttpResponse.BadRequest(res, 'La marca no puede exceder los 100 caracteres')

	// Validaciones para boatCategory
	if (input.boatCategory.length < 2) return HttpResponse.BadRequest(res, 'La categoría de embarcación debe tener al menos 2 caracteres')
	if (input.boatCategory.length > 50) return HttpResponse.BadRequest(res, 'La categoría de embarcación no puede exceder los 50 caracteres')

	// Validaciones para material
	if (input.material.length < 2) return HttpResponse.BadRequest(res, 'El material debe tener al menos 2 caracteres')
	if (input.material.length > 50) return HttpResponse.BadRequest(res, 'El material no puede exceder los 50 caracteres')

	// Validaciones para hullType
	if (input.hullType.length < 2) return HttpResponse.BadRequest(res, 'El tipo de casco debe tener al menos 2 caracteres')
	if (input.hullType.length > 50) return HttpResponse.BadRequest(res, 'El tipo de casco no puede exceder los 50 caracteres')

	// Validaciones para motorType (opcional)
	if (input.motorType !== undefined && input.motorType.length > 50) {
		return HttpResponse.BadRequest(res, 'El tipo de motor no puede exceder los 50 caracteres')
	}

	// Validaciones numéricas
	if (isNaN(input.passengerCapacity) || input.passengerCapacity < 1) {
		return HttpResponse.BadRequest(res, 'La capacidad de pasajeros debe ser un número entero positivo (mínimo 1)')
	}
	if (!Number.isInteger(input.passengerCapacity)) {
		return HttpResponse.BadRequest(res, 'La capacidad de pasajeros debe ser un número entero')
	}
	if (input.passengerCapacity > 100) {
		return HttpResponse.BadRequest(res, 'La capacidad de pasajeros no puede exceder 100')
	}

	if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
		return HttpResponse.BadRequest(res, 'La capacidad máxima de peso debe ser un número positivo')
	}
	if (input.maxWeightCapacity > 50000) {
		return HttpResponse.BadRequest(res, 'La capacidad máxima de peso parece poco realista (máx: 50,000 kg)')
	}

	if (isNaN(input.length) || input.length <= 0) {
		return HttpResponse.BadRequest(res, 'La longitud debe ser un número positivo')
	}
	if (input.length > 50) {
		return HttpResponse.BadRequest(res, 'La longitud parece poco realista (máx: 50 metros)')
	}

	if (isNaN(input.beam) || input.beam <= 0) {
		return HttpResponse.BadRequest(res, 'La manga debe ser un número positivo')
	}
	if (input.beam > 15) {
		return HttpResponse.BadRequest(res, 'La manga parece poco realista (máx: 15 metros)')
	}

	if (input.maxHorsePower !== undefined) {
		if (isNaN(input.maxHorsePower) || input.maxHorsePower < 0) {
			return HttpResponse.BadRequest(res, 'La potencia máxima debe ser un número positivo')
		}
		if (!Number.isInteger(input.maxHorsePower)) {
			return HttpResponse.BadRequest(res, 'La potencia máxima debe ser un número entero')
		}
		if (input.maxHorsePower > 5000) {
			return HttpResponse.BadRequest(res, 'La potencia máxima parece poco realista (máx: 5,000 HP)')
		}
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	// Validaciones para model (si se proporciona)
	if (input.model !== undefined) {
		if (!input.model || input.model.trim() === '') {
			return HttpResponse.BadRequest(res, 'El modelo no puede estar vacío')
		}
		if (input.model.length < 2) {
			return HttpResponse.BadRequest(res, 'El modelo debe tener al menos 2 caracteres')
		}
		if (input.model.length > 100) {
			return HttpResponse.BadRequest(res, 'El modelo no puede exceder los 100 caracteres')
		}
	}

	// Validaciones para brand (si se proporciona)
	if (input.brand !== undefined) {
		if (!input.brand || input.brand.trim() === '') {
			return HttpResponse.BadRequest(res, 'La marca no puede estar vacía')
		}
		if (input.brand.length < 2) {
			return HttpResponse.BadRequest(res, 'La marca debe tener al menos 2 caracteres')
		}
		if (input.brand.length > 100) {
			return HttpResponse.BadRequest(res, 'La marca no puede exceder los 100 caracteres')
		}
	}

	// Validaciones para boatCategory (si se proporciona)
	if (input.boatCategory !== undefined) {
		if (!input.boatCategory || input.boatCategory.trim() === '') {
			return HttpResponse.BadRequest(res, 'La categoría de embarcación no puede estar vacía')
		}
		if (input.boatCategory.length < 2) {
			return HttpResponse.BadRequest(res, 'La categoría de embarcación debe tener al menos 2 caracteres')
		}
		if (input.boatCategory.length > 50) {
			return HttpResponse.BadRequest(res, 'La categoría de embarcación no puede exceder los 50 caracteres')
		}
	}

	// Validaciones para material (si se proporciona)
	if (input.material !== undefined) {
		if (!input.material || input.material.trim() === '') {
			return HttpResponse.BadRequest(res, 'El material no puede estar vacío')
		}
		if (input.material.length < 2) {
			return HttpResponse.BadRequest(res, 'El material debe tener al menos 2 caracteres')
		}
		if (input.material.length > 50) {
			return HttpResponse.BadRequest(res, 'El material no puede exceder los 50 caracteres')
		}
	}

	// Validaciones para hullType (si se proporciona)
	if (input.hullType !== undefined) {
		if (!input.hullType || input.hullType.trim() === '') {
			return HttpResponse.BadRequest(res, 'El tipo de casco no puede estar vacío')
		}
		if (input.hullType.length < 2) {
			return HttpResponse.BadRequest(res, 'El tipo de casco debe tener al menos 2 caracteres')
		}
		if (input.hullType.length > 50) {
			return HttpResponse.BadRequest(res, 'El tipo de casco no puede exceder los 50 caracteres')
		}
	}

	// Validaciones para motorType (si se proporciona)
	if (input.motorType !== undefined) {
		if (input.motorType !== null && input.motorType !== '' && input.motorType.length > 50) {
			return HttpResponse.BadRequest(res, 'El tipo de motor no puede exceder los 50 caracteres')
		}
	}

	// Validaciones numéricas (si se proporcionan)
	if (input.passengerCapacity !== undefined) {
		if (isNaN(input.passengerCapacity) || input.passengerCapacity < 1) {
			return HttpResponse.BadRequest(res, 'La capacidad de pasajeros debe ser un número entero positivo (mínimo 1)')
		}
		if (!Number.isInteger(input.passengerCapacity)) {
			return HttpResponse.BadRequest(res, 'La capacidad de pasajeros debe ser un número entero')
		}
		if (input.passengerCapacity > 100) {
			return HttpResponse.BadRequest(res, 'La capacidad de pasajeros no puede exceder 100')
		}
	}

	if (input.maxWeightCapacity !== undefined) {
		if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
			return HttpResponse.BadRequest(res, 'La capacidad máxima de peso debe ser un número positivo')
		}
		if (input.maxWeightCapacity > 50000) {
			return HttpResponse.BadRequest(res, 'La capacidad máxima de peso parece poco realista (máx: 50,000 kg)')
		}
	}

	if (input.length !== undefined) {
		if (isNaN(input.length) || input.length <= 0) {
			return HttpResponse.BadRequest(res, 'La longitud debe ser un número positivo')
		}
		if (input.length > 50) {
			return HttpResponse.BadRequest(res, 'La longitud parece poco realista (máx: 50 metros)')
		}
	}

	if (input.beam !== undefined) {
		if (isNaN(input.beam) || input.beam <= 0) {
			return HttpResponse.BadRequest(res, 'La manga debe ser un número positivo')
		}
		if (input.beam > 15) {
			return HttpResponse.BadRequest(res, 'La manga parece poco realista (máx: 15 metros)')
		}
	}

	if (input.maxHorsePower !== undefined) {
		if (isNaN(input.maxHorsePower) || input.maxHorsePower < 0) {
			return HttpResponse.BadRequest(res, 'La potencia máxima debe ser un número positivo')
		}
		if (!Number.isInteger(input.maxHorsePower)) {
			return HttpResponse.BadRequest(res, 'La potencia máxima debe ser un número entero')
		}
		if (input.maxHorsePower > 5000) {
			return HttpResponse.BadRequest(res, 'La potencia máxima parece poco realista (máx: 5,000 HP)')
		}
	}

	next()
}

export { sanitizeBoatTypeInput, validateCreateInput, validateUpdateInput }