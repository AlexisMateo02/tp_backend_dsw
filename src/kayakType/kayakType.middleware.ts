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

	if (!input.model) return HttpResponse.BadRequest(res, 'Model is required')
	if (!input.brand) return HttpResponse.BadRequest(res, 'Brand is required')
	if (!input.material) return HttpResponse.BadRequest(res, 'Material is required')
	if (input.paddlersQuantity === undefined) return HttpResponse.BadRequest(res, 'Paddlers quantity is required')
	if (input.maxWeightCapacity === undefined) return HttpResponse.BadRequest(res, 'Max weight capacity is required')
	if (!input.constructionType) return HttpResponse.BadRequest(res, 'Construction type is required')
	if (input.length === undefined) return HttpResponse.BadRequest(res, 'Length is required')
	if (input.beam === undefined) return HttpResponse.BadRequest(res, 'Beam is required')

	if (input.model.length < 2) return HttpResponse.BadRequest(res, 'Model must be at least 2 characters')
	if (input.model.length > 100) return HttpResponse.BadRequest(res, 'Model cannot exceed 100 characters')

	if (input.brand.length < 2) return HttpResponse.BadRequest(res, 'Brand must be at least 2 characters')
	if (input.brand.length > 100) return HttpResponse.BadRequest(res, 'Brand cannot exceed 100 characters')

	if (input.material.length < 2) return HttpResponse.BadRequest(res, 'Material must be at least 2 characters')
	if (input.material.length > 50) return HttpResponse.BadRequest(res, 'Material cannot exceed 50 characters')

	if (input.constructionType.length < 2)
		return HttpResponse.BadRequest(res, 'Construction type must be at least 2 characters')
	if (input.constructionType.length > 50)
		return HttpResponse.BadRequest(res, 'Construction type cannot exceed 50 characters')

	if (isNaN(input.paddlersQuantity) || input.paddlersQuantity < 1) {
		return HttpResponse.BadRequest(res, 'Paddlers quantity must be a positive integer (minimum 1)')
	}
	if (!Number.isInteger(input.paddlersQuantity)) {
		return HttpResponse.BadRequest(res, 'Paddlers quantity must be an integer')
	}

	if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
		return HttpResponse.BadRequest(res, 'Max weight capacity must be a positive number')
	}

	if (isNaN(input.length) || input.length <= 0) {
		return HttpResponse.BadRequest(res, 'Length must be a positive number')
	}

	if (isNaN(input.beam) || input.beam <= 0) {
		return HttpResponse.BadRequest(res, 'Beam must be a positive number')
	}

	if (input.paddlersQuantity > 10) {
		return HttpResponse.BadRequest(res, 'Paddlers quantity cannot exceed 10')
	}

	if (input.maxWeightCapacity > 1000) {
		return HttpResponse.BadRequest(res, 'Max weight capacity seems unrealistic (max: 1000 kg)')
	}

	if (input.length > 10) {
		return HttpResponse.BadRequest(res, 'Length seems unrealistic (max: 10 meters)')
	}

	if (input.beam > 3) {
		return HttpResponse.BadRequest(res, 'Beam seems unrealistic (max: 3 meters)')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'At least one field must be provided for update')
	}

	if (input.model !== undefined) {
		if (!input.model || input.model.trim() === '') {
			return HttpResponse.BadRequest(res, 'Model cannot be empty')
		}
		if (input.model.length < 2) {
			return HttpResponse.BadRequest(res, 'Model must be at least 2 characters')
		}
		if (input.model.length > 100) {
			return HttpResponse.BadRequest(res, 'Model cannot exceed 100 characters')
		}
	}

	if (input.brand !== undefined) {
		if (!input.brand || input.brand.trim() === '') {
			return HttpResponse.BadRequest(res, 'Brand cannot be empty')
		}
		if (input.brand.length < 2) {
			return HttpResponse.BadRequest(res, 'Brand must be at least 2 characters')
		}
		if (input.brand.length > 100) {
			return HttpResponse.BadRequest(res, 'Brand cannot exceed 100 characters')
		}
	}

	if (input.material !== undefined) {
		if (!input.material || input.material.trim() === '') {
			return HttpResponse.BadRequest(res, 'Material cannot be empty')
		}
		if (input.material.length < 2) {
			return HttpResponse.BadRequest(res, 'Material must be at least 2 characters')
		}
		if (input.material.length > 50) {
			return HttpResponse.BadRequest(res, 'Material cannot exceed 50 characters')
		}
	}

	if (input.constructionType !== undefined) {
		if (!input.constructionType || input.constructionType.trim() === '') {
			return HttpResponse.BadRequest(res, 'Construction type cannot be empty')
		}
		if (input.constructionType.length < 2) {
			return HttpResponse.BadRequest(res, 'Construction type must be at least 2 characters')
		}
		if (input.constructionType.length > 50) {
			return HttpResponse.BadRequest(res, 'Construction type cannot exceed 50 characters')
		}
	}

	if (input.paddlersQuantity !== undefined) {
		if (isNaN(input.paddlersQuantity) || input.paddlersQuantity < 1) {
			return HttpResponse.BadRequest(res, 'Paddlers quantity must be a positive integer (minimum 1)')
		}
		if (!Number.isInteger(input.paddlersQuantity)) {
			return HttpResponse.BadRequest(res, 'Paddlers quantity must be an integer')
		}
		if (input.paddlersQuantity > 10) {
			return HttpResponse.BadRequest(res, 'Paddlers quantity cannot exceed 10')
		}
	}

	if (input.maxWeightCapacity !== undefined) {
		if (isNaN(input.maxWeightCapacity) || input.maxWeightCapacity <= 0) {
			return HttpResponse.BadRequest(res, 'Max weight capacity must be a positive number')
		}
		if (input.maxWeightCapacity > 1000) {
			return HttpResponse.BadRequest(res, 'Max weight capacity seems unrealistic (max: 1000 kg)')
		}
	}

	if (input.length !== undefined) {
		if (isNaN(input.length) || input.length <= 0) {
			return HttpResponse.BadRequest(res, 'Length must be a positive number')
		}
		if (input.length > 10) {
			return HttpResponse.BadRequest(res, 'Length seems unrealistic (max: 10 meters)')
		}
	}

	if (input.beam !== undefined) {
		if (isNaN(input.beam) || input.beam <= 0) {
			return HttpResponse.BadRequest(res, 'Beam must be a positive number')
		}
		if (input.beam > 3) {
			return HttpResponse.BadRequest(res, 'Beam seems unrealistic (max: 3 meters)')
		}
	}

	next()
}

export { sanitizeKayakTypeInput, validateCreateInput, validateUpdateInput }
