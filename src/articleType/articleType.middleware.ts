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

	if (!input.name) return HttpResponse.BadRequest(res, 'Name is required')
	if (!input.mainUse) return HttpResponse.BadRequest(res, 'Main use is required')

	if (input.name.length < 2) {
		return HttpResponse.BadRequest(res, 'Name must be at least 2 characters')
	}
	if (input.name.length > 100) {
		return HttpResponse.BadRequest(res, 'Name cannot exceed 100 characters')
	}

	if (input.mainUse.length < 3) {
		return HttpResponse.BadRequest(res, 'Main use must be at least 3 characters')
	}
	if (input.mainUse.length > 255) {
		return HttpResponse.BadRequest(res, 'Main use cannot exceed 255 characters')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'At least one field must be provided for update')
	}

	if (input.name !== undefined) {
		if (!input.name || input.name.trim() === '') {
			return HttpResponse.BadRequest(res, 'Name cannot be empty')
		}
		if (input.name.length < 2) {
			return HttpResponse.BadRequest(res, 'Name must be at least 2 characters')
		}
		if (input.name.length > 100) {
			return HttpResponse.BadRequest(res, 'Name cannot exceed 100 characters')
		}
	}

	if (input.mainUse !== undefined) {
		if (!input.mainUse || input.mainUse.trim() === '') {
			return HttpResponse.BadRequest(res, 'Main use cannot be empty')
		}
		if (input.mainUse.length < 3) {
			return HttpResponse.BadRequest(res, 'Main use must be at least 3 characters')
		}
		if (input.mainUse.length > 255) {
			return HttpResponse.BadRequest(res, 'Main use cannot exceed 255 characters')
		}
	}

	next()
}

export { sanitizeArticleTypeInput, validateCreateInput, validateUpdateInput }
