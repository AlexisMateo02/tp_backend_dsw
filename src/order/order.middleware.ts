import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { OrderStatus } from './order.entity.js'

function sanitizeOrderInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		totalAmount: req.body.totalAmount !== undefined ? parseFloat(req.body.totalAmount) : undefined,
		buyerContact: typeof req.body.buyerContact === 'string' ? req.body.buyerContact.trim() : undefined,
		notes: typeof req.body.notes === 'string' ? req.body.notes.trim() : undefined,
		userId: req.body.userId !== undefined ? Number(req.body.userId) : undefined,
		pickUpPointId: req.body.pickUpPointId !== undefined ? Number(req.body.pickUpPointId) : undefined,
		status: req.body.status !== undefined ? req.body.status.toString().trim().toLowerCase() : undefined,
		items: Array.isArray(req.body.items) ? req.body.items.map((item: any) => ({
			productId: item.productId !== undefined ? Number(item.productId) : undefined,
			quantity: item.quantity !== undefined ? Number(item.quantity) : undefined,
			priceAtPurchase: typeof item.priceAtPurchase === 'string' ? item.priceAtPurchase.trim() : undefined,
		})) : undefined,
	}

	// Eliminar campos undefined
	Object.keys(req.body.sanitizedInput).forEach(key => {
		if (req.body.sanitizedInput[key] === undefined) {
			delete req.body.sanitizedInput[key]
		}
	})

	next()
}

function validateCreateOrderInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	// Campos obligatorios
	if (!input.totalAmount) return HttpResponse.BadRequest(res, 'El monto total es requerido')
	if (!input.buyerContact) return HttpResponse.BadRequest(res, 'El contacto del comprador es requerido')
	if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
		return HttpResponse.BadRequest(res, 'La orden debe contener al menos un item')
	}

	// Validar totalAmount
	if (isNaN(input.totalAmount) || input.totalAmount <= 0) {
		return HttpResponse.BadRequest(res, 'El monto total debe ser un número mayor a 0')
	}

	// Validar buyerContact
	if (input.buyerContact.length < 2) {
		return HttpResponse.BadRequest(res, 'El contacto del comprador debe tener al menos 2 caracteres')
	}
	if (input.buyerContact.length > 100) {
		return HttpResponse.BadRequest(res, 'El contacto del comprador no puede exceder los 100 caracteres')
	}

	// Validar buyerContact (puede ser email o teléfono)
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/
	
	if (!emailRegex.test(input.buyerContact) && !phoneRegex.test(input.buyerContact)) {
		return HttpResponse.BadRequest(res, 'El contacto del comprador debe ser un email o teléfono válido')
	}

	// Validar items
	for (let i = 0; i < input.items.length; i++) {
		const item = input.items[i]
		if (!item.productId || isNaN(item.productId) || item.productId <= 0) {
			return HttpResponse.BadRequest(res, `El productId del item ${i+1} es inválido`)
		}
		if (!item.quantity || isNaN(item.quantity) || item.quantity <= 0) {
			return HttpResponse.BadRequest(res, `La cantidad del item ${i+1} es inválida`)
		}
		if (!item.priceAtPurchase) {
			return HttpResponse.BadRequest(res, `El precio de compra del item ${i+1} es requerido`)
		}
		// Validar que priceAtPurchase sea un string que represente un número positivo
		const priceValue = parseFloat(item.priceAtPurchase.replace(/[^\d.]/g, ''))
		if (isNaN(priceValue) || priceValue <= 0) {
			return HttpResponse.BadRequest(res, `El precio de compra del item ${i+1} no es válido`)
		}
	}

	// Validar userId si está presente
	if (input.userId !== undefined && (isNaN(input.userId) || input.userId <= 0)) {
		return HttpResponse.BadRequest(res, 'El ID de usuario debe ser un número válido')
	}

	// Validar pickUpPointId si está presente
	if (input.pickUpPointId !== undefined && (isNaN(input.pickUpPointId) || input.pickUpPointId <= 0)) {
		return HttpResponse.BadRequest(res, 'El ID del punto de retiro debe ser un número válido')
	}

	next()
}

function validateUpdateOrderInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	const hasFields = Object.keys(input).some(key => input[key] !== undefined)
	if (!hasFields) {
		return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
	}

	// Solo permitir actualización de status y notes
	const allowedFields = ['status', 'notes']
	const invalidFields = Object.keys(input).filter(key => !allowedFields.includes(key))
	if (invalidFields.length > 0) {
		return HttpResponse.BadRequest(res, `Solo se pueden actualizar los campos: ${allowedFields.join(', ')}`)
	}

	// Validar status si está presente
	if (input.status !== undefined) {
		const validStatuses = Object.values(OrderStatus)
		if (!validStatuses.includes(input.status)) {
			return HttpResponse.BadRequest(res, `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`)
		}
	}

	// Validar notes si está presente
	if (input.notes !== undefined) {
		if (input.notes.length > 1000) {
			return HttpResponse.BadRequest(res, 'Las notas no pueden exceder los 1000 caracteres')
		}
	}

	next()
}

function validateUpdateStatusInput(req: Request, res: Response, next: NextFunction) {
	const input = req.body.sanitizedInput

	if (!input.status) {
		return HttpResponse.BadRequest(res, 'El estado es requerido')
	}

	const validStatuses = Object.values(OrderStatus)
	if (!validStatuses.includes(input.status)) {
		return HttpResponse.BadRequest(res, `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`)
	}

	next()
}

export { 
	sanitizeOrderInput, 
	validateCreateOrderInput, 
	validateUpdateOrderInput,
	validateUpdateStatusInput 
}