import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { OrderStatus, DeliveryType } from './order.entity.js'

function sanitizeOrderInput(req: Request, res: Response, next: NextFunction) {
	req.body.sanitizedInput = {
		deliveryType: req.body.deliveryType !== undefined ? req.body.deliveryType.toString().trim().toLowerCase() : undefined,
		totalAmount: req.body.totalAmount !== undefined ? parseFloat(req.body.totalAmount) : undefined,
		shippingCost: req.body.shippingCost !== undefined ? parseFloat(req.body.shippingCost) : undefined,
		taxAmount: req.body.taxAmount !== undefined ? parseFloat(req.body.taxAmount) : undefined,
		buyerName: typeof req.body.buyerName === 'string' ? req.body.buyerName.trim() : undefined,
		buyerEmail: typeof req.body.buyerEmail === 'string' ? req.body.buyerEmail.trim().toLowerCase() : undefined,
		buyerPhone: typeof req.body.buyerPhone === 'string' ? req.body.buyerPhone.trim().replace(/\s+/g, '') : undefined,
		shippingAddress: typeof req.body.shippingAddress === 'string' ? req.body.shippingAddress.trim() : undefined,
		shippingCity: typeof req.body.shippingCity === 'string' ? req.body.shippingCity.trim() : undefined,
		shippingPostalCode: typeof req.body.shippingPostalCode === 'string' ? req.body.shippingPostalCode.trim().replace(/\s+/g, '') : undefined,
		shippingProvince: typeof req.body.shippingProvince === 'string' ? req.body.shippingProvince.trim() : undefined,
		pickupPointId: req.body.pickupPointId !== undefined ? Number(req.body.pickupPointId) : undefined,
		notes: typeof req.body.notes === 'string' ? req.body.notes.trim() : undefined,
		userId: req.body.userId !== undefined ? Number(req.body.userId) : undefined,
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
	if (!input.deliveryType) return HttpResponse.BadRequest(res, 'El tipo de entrega es requerido')
	if (!input.totalAmount) return HttpResponse.BadRequest(res, 'El monto total es requerido')
	if (!input.buyerName) return HttpResponse.BadRequest(res, 'El nombre del comprador es requerido')
	if (!input.buyerEmail) return HttpResponse.BadRequest(res, 'El email del comprador es requerido')
	if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
		return HttpResponse.BadRequest(res, 'La orden debe contener al menos un item')
	}

	// Validar deliveryType
	const validDeliveryTypes = Object.values(DeliveryType)
	if (!validDeliveryTypes.includes(input.deliveryType)) {
		return HttpResponse.BadRequest(res, `Tipo de entrega inválido. Debe ser uno de: ${validDeliveryTypes.join(', ')}`)
	}

	// Validar totalAmount
	if (isNaN(input.totalAmount) || input.totalAmount <= 0) {
		return HttpResponse.BadRequest(res, 'El monto total debe ser un número mayor a 0')
	}

	// Validar buyerName
	if (input.buyerName.length < 2) {
		return HttpResponse.BadRequest(res, 'El nombre del comprador debe tener al menos 2 caracteres')
	}
	if (input.buyerName.length > 100) {
		return HttpResponse.BadRequest(res, 'El nombre del comprador no puede exceder los 100 caracteres')
	}

	// Validar buyerEmail
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(input.buyerEmail)) {
		return HttpResponse.BadRequest(res, 'El email del comprador no es válido')
	}

	// Validar buyerPhone si está presente
	if (input.buyerPhone && !/^\+?[0-9\s\-\(\)]{10,}$/.test(input.buyerPhone)) {
		return HttpResponse.BadRequest(res, 'El teléfono del comprador no es válido')
	}

	// Validar shippingCost si está presente
	if (input.shippingCost !== undefined && (isNaN(input.shippingCost) || input.shippingCost < 0)) {
		return HttpResponse.BadRequest(res, 'El costo de envío debe ser un número no negativo')
	}

	// Validar taxAmount si está presente
	if (input.taxAmount !== undefined && (isNaN(input.taxAmount) || input.taxAmount < 0)) {
		return HttpResponse.BadRequest(res, 'El impuesto debe ser un número no negativo')
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

	// Validaciones específicas por tipo de entrega
	if (input.deliveryType === DeliveryType.SHIP) {
		if (!input.shippingAddress) return HttpResponse.BadRequest(res, 'La dirección de envío es requerida para envío a domicilio')
		if (!input.shippingCity) return HttpResponse.BadRequest(res, 'La ciudad de envío es requerida para envío a domicilio')
		if (!input.shippingPostalCode) return HttpResponse.BadRequest(res, 'El código postal de envío es requerido para envío a domicilio')
		if (!input.shippingProvince) return HttpResponse.BadRequest(res, 'La provincia de envío es requerida para envío a domicilio')
	}

	if (input.deliveryType === DeliveryType.PICKUP) {
		if (!input.pickupPointId || isNaN(input.pickupPointId) || input.pickupPointId <= 0) {
			return HttpResponse.BadRequest(res, 'El punto de retiro es requerido para retiro en tienda')
		}
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