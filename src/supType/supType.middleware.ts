import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeSUPTypeInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		model: typeof req.body.model === 'string' ? req.body.model.trim() : undefined,
		brand: typeof req.body.brand === 'string' ? req.body.brand.trim() : undefined,
		material: typeof req.body.material === 'string' ? req.body.material.trim() : undefined,
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
		constructionType: typeof req.body.constructionType === 'string' ? req.body.constructionType.trim() : undefined,
		length:
			typeof req.body.length === 'number'
				? req.body.length
				: typeof req.body.length === 'string'
					? Number.parseFloat(req.body.length)
					: undefined,
		width:
			typeof req.body.width === 'number'
				? req.body.width
				: typeof req.body.width === 'string'
					? Number.parseFloat(req.body.width)
					: undefined,
		thickness:
			typeof req.body.thickness === 'number'
				? req.body.thickness
				: typeof req.body.thickness === 'string'
					? Number.parseFloat(req.body.thickness)
					: undefined,
		boardType: typeof req.body.boardType === 'string' ? req.body.boardType.trim() : undefined,
		finConfiguration: typeof req.body.finConfiguration === 'string' ? req.body.finConfiguration.trim() : undefined,
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
	if (!input.material) return HttpResponse.BadRequest(res, 'El material es requerido')
	if (input.paddlersQuantity === undefined) return HttpResponse.BadRequest(res, 'La cantidad de remeros es requerida')
	if (input.maxWeightCapacity === undefined) return HttpResponse.BadRequest(res, 'La capacidad máxima de peso es requerida')
	if (!input.constructionType) return HttpResponse.BadRequest(res, 'El tipo de construcción es requerido')
	if (input.length === undefined) return HttpResponse.BadRequest(res, 'La longitud es requerida')
	if (input.width === undefined) return HttpResponse.BadRequest(res, 'El ancho es requerido')
	if (input.thickness === undefined) return HttpResponse.BadRequest(res, 'El grosor es requerido')
	if (!input.boardType) return HttpResponse.BadRequest(res, 'El tipo de tabla es requerido')

	// Validaciones para model
	if (input.model.length < 2) return HttpResponse.BadRequest(res, 'El modelo debe tener al menos 2 caracteres')
	if (input.model.length > 100) return HttpResponse.BadRequest(res, 'El modelo no puede exceder los 100 caracteres')

	// Validaciones para brand
	if (input.brand.length < 2) return HttpResponse.BadRequest(res, 'La marca debe tener al menos 2 caracteres')
	if (input.brand.length > 100) return HttpResponse.BadRequest(res, 'La marca no puede exceder los 100 caracteres')

	// Validaciones para material
	if (input.material.length < 2) return HttpResponse.BadRequest(res, 'El material debe tener al menos 2 caracteres')
	if (input.material.length > 50) return HttpResponse.BadRequest(res, 'El material no puede exceder los 50 caracteres')

	// Validaciones para constructionType
	if (input.constructionType.length < 2) return HttpResponse.BadRequest(res, 'El tipo de construcción debe tener al menos 2 caracteres')
	if (input.constructionType.length > 50) return HttpResponse.BadRequest(res, 'El tipo de construcción no puede exceder los 50 caracteres')

	// Validaciones para boardType
	if (input.boardType.length < 2) return HttpResponse.BadRequest(res, 'El tipo de tabla debe tener al menos 2 caracteres')
	if (input.boardType.length > 50) return HttpResponse.BadRequest(res, 'El tipo de tabla no puede exceder los 50 caracteres')

	// Validaciones para finConfiguration (opcional)
	if (input.finConfiguration !== undefined && input.finConfiguration.length > 50) {
		return HttpResponse.BadRequest(res, 'La configuración de aletas no puede exceder los 50 caracteres')
	}

	// Validaciones numéricas
	if (isNaN(input.paddlersQuantity) || input.paddlersQuantity < 1) {
		return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero positivo (mínimo 1)')
	}
	if (!Number.isInteger(input.paddlersQuantity)) {
		return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero')
	}
	if (input.paddlersQuantity > 5) {
		return HttpResponse.BadRequest(res, 'La cantidad de remeros no puede exceder 5 para una tabla SUP')
	}

	if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
		return HttpResponse.BadRequest(res, 'La capacidad máxima de peso debe ser un número positivo')
	}
	if (input.maxWeightCapacity > 300) {
		return HttpResponse.BadRequest(res, 'La capacidad máxima de peso parece poco realista para una tabla SUP (máx: 300 kg)')
	}

	if (isNaN(input.length) || input.length <= 0) {
		return HttpResponse.BadRequest(res, 'La longitud debe ser un número positivo')
	}
	if (input.length < 2) {
		return HttpResponse.BadRequest(res, 'La longitud parece demasiado corta para una tabla SUP (mín: 2 metros)')
	}
	if (input.length > 6) {
		return HttpResponse.BadRequest(res, 'La longitud parece poco realista para una tabla SUP (máx: 6 metros)')
	}

	if (isNaN(input.width) || input.width <= 0) {
		return HttpResponse.BadRequest(res, 'El ancho debe ser un número positivo')
	}
	if (input.width < 0.5) {
		return HttpResponse.BadRequest(res, 'El ancho parece demasiado estrecho para una tabla SUP (mín: 0.5 metros)')
	}
	if (input.width > 1.5) {
		return HttpResponse.BadRequest(res, 'El ancho parece poco realista para una tabla SUP (máx: 1.5 metros)')
	}

	if (isNaN(input.thickness) || input.thickness <= 0) {
		return HttpResponse.BadRequest(res, 'El grosor debe ser un número positivo')
	}
	if (input.thickness < 0.05) {
		return HttpResponse.BadRequest(res, 'El grosor parece demasiado delgado para una tabla SUP (mín: 0.05 metros)')
	}
	if (input.thickness > 0.3) {
		return HttpResponse.BadRequest(res, 'El grosor parece poco realista para una tabla SUP (máx: 0.3 metros)')
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

	// Validaciones para constructionType (si se proporciona)
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

	// Validaciones para boardType (si se proporciona)
	if (input.boardType !== undefined) {
		if (!input.boardType || input.boardType.trim() === '') {
			return HttpResponse.BadRequest(res, 'El tipo de tabla no puede estar vacío')
		}
		if (input.boardType.length < 2) {
			return HttpResponse.BadRequest(res, 'El tipo de tabla debe tener al menos 2 caracteres')
		}
		if (input.boardType.length > 50) {
			return HttpResponse.BadRequest(res, 'El tipo de tabla no puede exceder los 50 caracteres')
		}
	}

	// Validaciones para finConfiguration (si se proporciona)
	if (input.finConfiguration !== undefined) {
		if (input.finConfiguration !== null && input.finConfiguration !== '' && input.finConfiguration.length > 50) {
			return HttpResponse.BadRequest(res, 'La configuración de aletas no puede exceder los 50 caracteres')
		}
	}

	// Validaciones numéricas (si se proporcionan)
	if (input.paddlersQuantity !== undefined) {
		if (isNaN(input.paddlersQuantity) || input.paddlersQuantity < 1) {
			return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero positivo (mínimo 1)')
		}
		if (!Number.isInteger(input.paddlersQuantity)) {
			return HttpResponse.BadRequest(res, 'La cantidad de remeros debe ser un número entero')
		}
		if (input.paddlersQuantity > 5) {
			return HttpResponse.BadRequest(res, 'La cantidad de remeros no puede exceder 5 para una tabla SUP')
		}
	}

	if (input.maxWeightCapacity !== undefined) {
		if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
			return HttpResponse.BadRequest(res, 'La capacidad máxima de peso debe ser un número positivo')
		}
		if (input.maxWeightCapacity > 300) {
			return HttpResponse.BadRequest(res, 'La capacidad máxima de peso parece poco realista para una tabla SUP (máx: 300 kg)')
		}
	}

	if (input.length !== undefined) {
		if (isNaN(input.length) || input.length <= 0) {
			return HttpResponse.BadRequest(res, 'La longitud debe ser un número positivo')
		}
		if (input.length < 2) {
			return HttpResponse.BadRequest(res, 'La longitud parece demasiado corta para una tabla SUP (mín: 2 metros)')
		}
		if (input.length > 6) {
			return HttpResponse.BadRequest(res, 'La longitud parece poco realista para una tabla SUP (máx: 6 metros)')
		}
	}

	if (input.width !== undefined) {
		if (isNaN(input.width) || input.width <= 0) {
			return HttpResponse.BadRequest(res, 'El ancho debe ser un número positivo')
		}
		if (input.width < 0.5) {
			return HttpResponse.BadRequest(res, 'El ancho parece demasiado estrecho para una tabla SUP (mín: 0.5 metros)')
		}
		if (input.width > 1.5) {
			return HttpResponse.BadRequest(res, 'El ancho parece poco realista para una tabla SUP (máx: 1.5 metros)')
		}
	}

	if (input.thickness !== undefined) {
		if (isNaN(input.thickness) || input.thickness <= 0) {
			return HttpResponse.BadRequest(res, 'El grosor debe ser un número positivo')
		}
		if (input.thickness < 0.05) {
			return HttpResponse.BadRequest(res, 'El grosor parece demasiado delgado para una tabla SUP (mín: 0.05 metros)')
		}
		if (input.thickness > 0.3) {
			return HttpResponse.BadRequest(res, 'El grosor parece poco realista para una tabla SUP (máx: 0.3 metros)')
		}
	}

	next()
}

// Middleware adicional para validar ID en parámetros
function validateIdParam(req: Request, res: Response, next: NextFunction) {
    const id = Number.parseInt(req.params.id)
    
    if (isNaN(id) || id <= 0) {
        return HttpResponse.BadRequest(res, 'ID de tipo SUP inválido')
    }
    
    next()
}

export { 
    sanitizeSUPTypeInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam 
}