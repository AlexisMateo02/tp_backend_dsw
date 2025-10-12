import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeKayakTypeInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		model: typeof req.body.model === 'string' ? req.body.model.trim() : undefined,
		brand: typeof req.body.brand === 'string' ? req.body.brand.trim().toUpperCase() : undefined,
		material: typeof req.body.material === 'string' ? req.body.material.trim().toUpperCase() : undefined,
		paddlersQuantity:
			typeof req.body.paddlersQuantity === 'number'
				? req.body.paddlersQuantity
				: typeof req.body.paddlersQuantity === 'string'
				? Number.parseInt(req.body.paddlersQuantity)
				: undefined,
		maxWeightCapacity:
			typeof req.body.maxWeightCapacity === 'number'
				? req.body.maxWeightCapacity
				: typeof req.body.maxWeightCapacity === 'string'
				? Number.parseFloat(req.body.maxWeightCapacity)
				: undefined,
		constructionType:
			typeof req.body.constructionType === 'string' ? req.body.constructionType.trim().toUpperCase() : undefined,
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

	if (!input.model) return HttpResponse.BadRequest(res, 'El modelo es requerido')
	if (!input.brand) return HttpResponse.BadRequest(res, 'La marca es requerida')
	if (!input.material) return HttpResponse.BadRequest(res, 'El material es requerido')
	if (input.paddlersQuantity === undefined) return HttpResponse.BadRequest(res, 'La cantidad de remeros es requerida')
	if (input.maxWeightCapacity === undefined)
		return HttpResponse.BadRequest(res, 'La capacidad máxima de peso es requerida')
	if (!input.constructionType) return HttpResponse.BadRequest(res, 'El tipo de construcción es requerido')
	if (input.length === undefined) return HttpResponse.BadRequest(res, 'La longitud es requerida')
	if (input.beam === undefined) return HttpResponse.BadRequest(res, 'La manga es requerida')

	if (input.model.length < 2) return HttpResponse.BadRequest(res, 'El modelo debe tener al menos 2 caracteres')
	if (input.model.length > 100) return HttpResponse.BadRequest(res, 'El modelo no puede exceder los 100 caracteres')

	if (input.brand.length < 2) return HttpResponse.BadRequest(res, 'El modelo no puede exceder los 100 caracteres')
	if (input.brand.length > 100) return HttpResponse.BadRequest(res, 'La marca no puede exceder los 100 caracteres')

	if (input.material.length < 2) return HttpResponse.BadRequest(res, 'El material debe tener al menos 2 caracteres')
	if (input.material.length > 50) return HttpResponse.BadRequest(res, 'El material no puede exceder los 50 caracteres')

	if (input.constructionType.length < 2)
		return HttpResponse.BadRequest(res, 'El tipo de construcción debe tener al menos 2 caracteres')
	if (input.constructionType.length > 50)
		return HttpResponse.BadRequest(res, 'El tipo de construcción no puede exceder los 50 caracteres')

	if (isNaN(input.paddlersQuantity) || input.paddlersQuantity < 1) {
		return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero positivo (mínimo 1)')
	}
	if (!Number.isInteger(input.paddlersQuantity)) {
		return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero')
	}

	if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
		return HttpResponse.BadRequest(res, 'La capacidad máxima de peso debe ser un número positivo')
	}

	if (isNaN(input.length) || input.length <= 0) {
		return HttpResponse.BadRequest(res, 'La longitud debe ser un número positivo')
	}

	if (isNaN(input.beam) || input.beam <= 0) {
		return HttpResponse.BadRequest(res, 'La manga debe ser un número positivo')
	}

	if (input.paddlersQuantity > 10) {
		return HttpResponse.BadRequest(res, 'La cantidad de remeros no puede exceder 10')
	}

	if (input.maxWeightCapacity > 1000) {
		return HttpResponse.BadRequest(res, 'La capacidad máxima de peso parece poco realista (máx: 1000 kg)')
	}

	if (input.length > 10) {
		return HttpResponse.BadRequest(res, 'La longitud parece poco realista (máx: 10 metros)')
	}

	if (input.beam > 3) {
		return HttpResponse.BadRequest(res, 'La manga parece poco realista (máx: 3 metros)')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

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

	if (input.constructionType !== undefined) {
		if (!input.constructionType || input.constructionType.trim() === '') {
			return HttpResponse.BadRequest(res, 'El tipo de construcción no puede estar vacío')
		}
		if (input.constructionType.length < 2) {
			return HttpResponse.BadRequest(res, 'El tipo de construcción debe tener al menos 2 caracteres')
		}
		if (input.constructionType.length > 50) {
			return HttpResponse.BadRequest(res, 'El tipo de construcción no puede exceder los 50 caracteres')
		}
	}

	if (input.paddlersQuantity !== undefined) {
		if (isNaN(input.paddlersQuantity) || input.paddlersQuantity < 1) {
			return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero positivo (mínimo 1)')
		}
		if (!Number.isInteger(input.paddlersQuantity)) {
			return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero')
		}
		if (input.paddlersQuantity > 10) {
			return HttpResponse.BadRequest(res, 'La cantidad de remeros no puede exceder 10')
		}
	}

	if (input.maxWeightCapacity !== undefined) {
		if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
			return HttpResponse.BadRequest(res, 'La capacidad máxima de peso debe ser un número positivo')
		}
		if (input.maxWeightCapacity > 1000) {
			return HttpResponse.BadRequest(res, 'La capacidad máxima de peso parece poco realista (máx: 1000 kg)')
		}
	}

	if (input.length !== undefined) {
		if (isNaN(input.length) || input.length <= 0) {
			return HttpResponse.BadRequest(res, 'La longitud debe ser un número positivo')
		}
		if (input.length > 10) {
			return HttpResponse.BadRequest(res, 'La longitud parece poco realista (máx: 10 metros)')
		}
	}

	if (input.beam !== undefined) {
		if (isNaN(input.beam) || input.beam <= 0) {
			return HttpResponse.BadRequest(res, 'La manga debe ser un número positivo')
		}
		if (input.beam > 3) {
			return HttpResponse.BadRequest(res, 'La manga parece poco realista (máx: 3 metros)')
		}
	}

	next()
}

export { sanitizeKayakTypeInput, validateCreateInput, validateUpdateInput }
