import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { UserRole } from './user.entity.js'

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		firstName: typeof req.body.firstName === 'string' ? req.body.firstName.trim() : undefined,
		lastName: typeof req.body.lastName === 'string' ? req.body.lastName.trim() : undefined,
		email: typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : undefined,
		password: typeof req.body.password === 'string' ? req.body.password : undefined,
		phone: typeof req.body.phone === 'string' ? req.body.phone.trim() : undefined,
		role: req.body.role as UserRole,
	}

	// Eliminar campos undefined
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
	if (!input.firstName) return HttpResponse.BadRequest(res, 'El nombre es requerido')
	if (!input.lastName) return HttpResponse.BadRequest(res, 'El apellido es requerido')
	if (!input.email) return HttpResponse.BadRequest(res, 'El email es requerido')
	if (!input.password) return HttpResponse.BadRequest(res, 'La contraseña es requerida')

	// Validaciones para firstName
	if (input.firstName.length < 2) {
		return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
	}
	if (input.firstName.length > 50) {
		return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 50 caracteres')
	}

	// Validaciones para lastName
	if (input.lastName.length < 2) {
		return HttpResponse.BadRequest(res, 'El apellido debe tener al menos 2 caracteres')
	}
	if (input.lastName.length > 50) {
		return HttpResponse.BadRequest(res, 'El apellido no puede exceder los 50 caracteres')
	}

	// Validaciones para email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(input.email)) {
		return HttpResponse.BadRequest(res, 'El email no tiene un formato válido')
	}

	// Validaciones para password
	if (input.password.length < 6) {
		return HttpResponse.BadRequest(res, 'La contraseña debe tener al menos 6 caracteres')
	}
	if (input.password.length > 100) {
		return HttpResponse.BadRequest(res, 'La contraseña no puede exceder los 100 caracteres')
	}

	// Validaciones para phone (opcional pero si está presente)
	if (input.phone && input.phone.trim() !== '') {
		const phoneRegex = /^\+?\d{8,}$/
		if (!phoneRegex.test(input.phone.trim())) {
			return HttpResponse.BadRequest(res, 'El teléfono debe contener solo números (mínimo 8 dígitos)')
		}
	}

	// Validaciones para role (si está presente)
	if (input.role && !Object.values(UserRole).includes(input.role)) {
		return HttpResponse.BadRequest(res, 'El rol no es válido')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	if (input.firstName !== undefined) {
		if (!input.firstName || input.firstName.trim() === '') {
			return HttpResponse.BadRequest(res, 'El nombre no puede estar vacío')
		}
		if (input.firstName.length < 2) {
			return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
		}
		if (input.firstName.length > 50) {
			return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 50 caracteres')
		}
	}

	if (input.lastName !== undefined) {
		if (!input.lastName || input.lastName.trim() === '') {
			return HttpResponse.BadRequest(res, 'El apellido no puede estar vacío')
		}
		if (input.lastName.length < 2) {
			return HttpResponse.BadRequest(res, 'El apellido debe tener al menos 2 caracteres')
		}
		if (input.lastName.length > 50) {
			return HttpResponse.BadRequest(res, 'El apellido no puede exceder los 50 caracteres')
		}
	}

	if (input.email !== undefined) {
		if (!input.email || input.email.trim() === '') {
			return HttpResponse.BadRequest(res, 'El email no puede estar vacío')
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(input.email)) {
			return HttpResponse.BadRequest(res, 'El email no tiene un formato válido')
		}
	}

	if (input.password !== undefined) {
		if (input.password.length < 6) {
			return HttpResponse.BadRequest(res, 'La contraseña debe tener al menos 6 caracteres')
		}
		if (input.password.length > 100) {
			return HttpResponse.BadRequest(res, 'La contraseña no puede exceder los 100 caracteres')
		}
	}

	if (input.phone !== undefined && input.phone !== '') {
		const phoneRegex = /^\+?\d{8,}$/
		if (!phoneRegex.test(input.phone.trim())) {
			return HttpResponse.BadRequest(res, 'El teléfono debe contener solo números (mínimo 8 dígitos)')
		}
	}

	if (input.role !== undefined && !Object.values(UserRole).includes(input.role)) {
		return HttpResponse.BadRequest(res, 'El rol no es válido')
	}

	next()
}

function authorizeSelfOrAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.user) {
		return HttpResponse.Unauthorized(res, 'Usuario no autenticado')
	}

	const requestedUserId = Number.parseInt(req.params.id)
	if (req.user.role === UserRole.ADMIN || req.user.userId === requestedUserId) {
		next()
	} else {
		return HttpResponse.Forbidden(res, 'No tienes permisos para realizar esta acción')
	}
}

export { sanitizeUserInput, validateCreateInput, validateUpdateInput, authorizeSelfOrAdmin }
