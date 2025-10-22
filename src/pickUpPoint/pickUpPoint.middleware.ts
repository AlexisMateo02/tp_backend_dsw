import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizePickUpPointInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		adressStreet: typeof req.body.adressStreet === 'string' ? req.body.adressStreet.trim() : undefined,
		adressnumber: !isNaN(Number(req.body.adressnumber)) ? Number(req.body.adressnumber) : undefined,
		adressFloor:
			!isNaN(Number(req.body.adressFloor)) && req.body.adressFloor !== '' ? Number(req.body.adressFloor) : undefined,
		adressApartment:
			typeof req.body.adressApartment === 'string' ? req.body.adressApartment.trim().toUpperCase() : undefined,
		tower: !isNaN(Number(req.body.tower)) && req.body.tower !== '' ? Number(req.body.tower) : undefined,
		localty: !isNaN(Number(req.body.localty)) ? Number(req.body.localty) : undefined, // Ahora es un ID numérico
	}

	// Eliminar propiedades undefined y null
	Object.keys(req.body.sanitizedInput).forEach(key => {
		if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
			delete req.body.sanitizedInput[key]
		}
	})

	next()
}

function validateCreateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	// Validar campos requeridos
	if (!input.adressStreet) {
		return HttpResponse.BadRequest(res, 'La calle es requerida')
	}
	if (!input.adressnumber) {
		return HttpResponse.BadRequest(res, 'El número de dirección es requerido')
	}
	if (!input.localty) {
		return HttpResponse.BadRequest(res, 'La localidad es requerida')
	}

	// Validaciones para adressStreet
	if (input.adressStreet.length < 2) {
		return HttpResponse.BadRequest(res, 'La calle debe tener al menos 2 caracteres')
	}
	if (input.adressStreet.length > 100) {
		return HttpResponse.BadRequest(res, 'La calle no puede exceder los 100 caracteres')
	}

	// Validaciones para adressnumber
	if (!Number.isInteger(input.adressnumber)) {
		return HttpResponse.BadRequest(res, 'El número de dirección debe ser un número entero')
	}
	if (input.adressnumber <= 0) {
		return HttpResponse.BadRequest(res, 'El número de dirección debe ser mayor a 0')
	}
	if (input.adressnumber > 99999) {
		return HttpResponse.BadRequest(res, 'El número de dirección no puede ser mayor a 99999')
	}

	// Validaciones para adressFloor (opcional)
	if (input.adressFloor !== undefined) {
		if (!Number.isInteger(input.adressFloor)) {
			return HttpResponse.BadRequest(res, 'El piso debe ser un número entero')
		}
		if (input.adressFloor <= 0) {
			return HttpResponse.BadRequest(res, 'El piso debe ser mayor a 0')
		}
		if (input.adressFloor > 200) {
			return HttpResponse.BadRequest(res, 'El piso no puede ser mayor a 200')
		}
	}

	// Validaciones para adressApartment (opcional)
	if (input.adressApartment !== undefined) {
		if (input.adressApartment.length === 0) {
			return HttpResponse.BadRequest(res, 'El departamento no puede estar vacío')
		}
		if (input.adressApartment.length > 10) {
			return HttpResponse.BadRequest(res, 'El departamento no puede exceder los 10 caracteres')
		}
		const apartmentRegex = /^[A-Z0-9\-]*$/
		if (!apartmentRegex.test(input.adressApartment)) {
			return HttpResponse.BadRequest(
				res,
				'El departamento solo puede contener letras mayúsculas, números y guiones'
			)
		}
	}

	// Validaciones para tower (opcional)
	if (input.tower !== undefined) {
		if (!Number.isInteger(input.tower)) {
			return HttpResponse.BadRequest(res, 'La torre debe ser un número entero')
		}
		if (input.tower <= 0) {
			return HttpResponse.BadRequest(res, 'La torre debe ser mayor a 0')
		}
		if (input.tower > 50) {
			return HttpResponse.BadRequest(res, 'La torre no puede ser mayor a 50')
		}
	}

	// Validaciones para localty (ahora es un ID)
	if (isNaN(input.localty) || input.localty <= 0) {
		return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
	}

	next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	// Verificar que hay al menos un campo para actualizar
	const hasFields = Object.keys(input).some(
		key => input[key] !== undefined && input[key] !== null && input[key] !== ''
	)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	// Validaciones para adressStreet (si se proporciona)
	if (input.adressStreet !== undefined) {
		if (!input.adressStreet || input.adressStreet.trim() === '') {
			return HttpResponse.BadRequest(res, 'La calle no puede estar vacía')
		}
		if (input.adressStreet.length < 2) {
			return HttpResponse.BadRequest(res, 'La calle debe tener al menos 2 caracteres')
		}
		if (input.adressStreet.length > 100) {
			return HttpResponse.BadRequest(res, 'La calle no puede exceder los 100 caracteres')
		}
	}

	// Validaciones para adressnumber (si se proporciona)
	if (input.adressnumber !== undefined) {
		if (!Number.isInteger(input.adressnumber)) {
			return HttpResponse.BadRequest(res, 'El número de dirección debe ser un número entero')
		}
		if (input.adressnumber <= 0) {
			return HttpResponse.BadRequest(res, 'El número de dirección debe ser mayor a 0')
		}
		if (input.adressnumber > 99999) {
			return HttpResponse.BadRequest(res, 'El número de dirección no puede ser mayor a 99999')
		}
	}

	// Validaciones para adressFloor (si se proporciona)
	if (input.adressFloor !== undefined && input.adressFloor !== null && input.adressFloor !== '') {
		if (!Number.isInteger(input.adressFloor)) {
			return HttpResponse.BadRequest(res, 'El piso debe ser un número entero')
		}
		if (input.adressFloor <= 0) {
			return HttpResponse.BadRequest(res, 'El piso debe ser mayor a 0')
		}
		if (input.adressFloor > 200) {
			return HttpResponse.BadRequest(res, 'El piso no puede ser mayor a 200')
		}
	}

	// Validaciones para adressApartment (si se proporciona)
	if (input.adressApartment !== undefined) {
		if (input.adressApartment !== null && input.adressApartment !== '') {
			if (input.adressApartment.length === 0) {
				return HttpResponse.BadRequest(res, 'El departamento no puede estar vacío')
			}
			if (input.adressApartment.length > 10) {
				return HttpResponse.BadRequest(res, 'El departamento no puede exceder los 10 caracteres')
			}
			const apartmentRegex = /^[A-Z0-9\-]*$/
			if (!apartmentRegex.test(input.adressApartment)) {
				return HttpResponse.BadRequest(
					res,
					'El departamento solo puede contener letras mayúsculas, números y guiones'
				)
			}
		} else {
			// Permitir establecer como null o string vacío para eliminar el valor
			input.adressApartment = null
		}
	}

	// Validaciones para tower (si se proporciona)
	if (input.tower !== undefined && input.tower !== null && input.tower !== '') {
		if (!Number.isInteger(input.tower)) {
			return HttpResponse.BadRequest(res, 'La torre debe ser un número entero')
		}
		if (input.tower <= 0) {
			return HttpResponse.BadRequest(res, 'La torre debe ser mayor a 0')
		}
		if (input.tower > 50) {
			return HttpResponse.BadRequest(res, 'La torre no puede ser mayor a 50')
		}
	}

	// Validaciones para localty (si se proporciona) - ahora es un ID
	if (input.localty !== undefined) {
		if (isNaN(input.localty) || input.localty <= 0) {
			return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
		}
	}

	next()
}

// Middleware adicional para validar ID en parámetros
function validateIdParam(req: Request, res: Response, next: NextFunction) {
	const id = Number.parseInt(req.params.id)

	if (isNaN(id) || id <= 0) {
		return HttpResponse.BadRequest(res, 'ID de punto de recogida inválido')
	}

	next()
}

export { sanitizePickUpPointInput, validateCreateInput, validateUpdateInput, validateIdParam }