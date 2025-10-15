import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
    const sanitizedInput: any = {}

    // Sanitizar campos de texto
    if (typeof req.body.firstName === 'string') {
        sanitizedInput.firstName = req.body.firstName.trim()
    }
    if (typeof req.body.lastName === 'string') {
        sanitizedInput.lastName = req.body.lastName.trim()
    }
    if (typeof req.body.email === 'string') {
        sanitizedInput.email = req.body.email.trim().toLowerCase()
    }
    if (typeof req.body.password === 'string') {
        sanitizedInput.password = req.body.password
    }
    if (typeof req.body.localty === 'string') {
        sanitizedInput.localty = req.body.localty.trim()
    }

    // Sanitizar números
    if (req.body.sellsQuantity !== undefined && req.body.sellsQuantity !== null && req.body.sellsQuantity !== '') {
        const sellsQuantity = Number(req.body.sellsQuantity)
        if (!isNaN(sellsQuantity)) {
            sanitizedInput.sellsQuantity = sellsQuantity
        }
    }

    // Sanitizar sellerType
    if (typeof req.body.sellerType === 'string') {
        sanitizedInput.sellerType = req.body.sellerType.trim()
    }

    req.body.sanitizedInput = sanitizedInput
    next()
}

function validateCreateInput(req: Request, res: Response, next: NextFunction) {
    const input = req.body.sanitizedInput

    // Validar campos requeridos
    if (!input.firstName || input.firstName.trim() === '') {
        return HttpResponse.BadRequest(res, 'El nombre es requerido')
    }
    if (!input.lastName || input.lastName.trim() === '') {
        return HttpResponse.BadRequest(res, 'El apellido es requerido')
    }
    if (!input.email || input.email.trim() === '') {
        return HttpResponse.BadRequest(res, 'El email es requerido')
    }
    if (!input.password) {
        return HttpResponse.BadRequest(res, 'La contraseña es requerida')
    }
    if (!input.localty) {
        return HttpResponse.BadRequest(res, 'La localidad es requerida')
    }

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
        return HttpResponse.BadRequest(res, 'El formato del email no es válido')
    }
    if (input.email.length > 100) {
        return HttpResponse.BadRequest(res, 'El email no puede exceder los 100 caracteres')
    }

    // Validaciones para password
    if (input.password.length < 6) {
        return HttpResponse.BadRequest(res, 'La contraseña debe tener al menos 6 caracteres')
    }
    if (input.password.length > 100) {
        return HttpResponse.BadRequest(res, 'La contraseña no puede exceder los 100 caracteres')
    }

    // Validaciones para localty (código postal)
    const zipCodeRegex = /^[0-9]{4,5}$/
    if (!zipCodeRegex.test(input.localty)) {
        return HttpResponse.BadRequest(res, 'El código postal debe contener entre 4 y 5 dígitos numéricos')
    }

    // Validaciones opcionales
    if (input.sellsQuantity !== undefined) {
        if (!Number.isInteger(input.sellsQuantity)) {
            return HttpResponse.BadRequest(res, 'La cantidad de ventas debe ser un número entero')
        }
        if (input.sellsQuantity < 0) {
            return HttpResponse.BadRequest(res, 'La cantidad de ventas no puede ser negativa')
        }
        if (input.sellsQuantity > 100000) {
            return HttpResponse.BadRequest(res, 'La cantidad de ventas no puede ser mayor a 100,000')
        }
    }

    if (input.sellerType !== undefined && input.sellerType.length > 50) {
        return HttpResponse.BadRequest(res, 'El tipo de vendedor no puede exceder los 50 caracteres')
    }

    next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
    const input = req.body.sanitizedInput

    // Verificar que hay al menos un campo para actualizar
    const hasFields = Object.keys(input).length > 0
    if (!hasFields) {
        return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
    }

    // Validaciones para firstName (si se proporciona)
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

    // Validaciones para lastName (si se proporciona)
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

    // Validaciones para email (si se proporciona)
    if (input.email !== undefined) {
        if (!input.email || input.email.trim() === '') {
            return HttpResponse.BadRequest(res, 'El email no puede estar vacío')
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(input.email)) {
            return HttpResponse.BadRequest(res, 'El formato del email no es válido')
        }
        if (input.email.length > 100) {
            return HttpResponse.BadRequest(res, 'El email no puede exceder los 100 caracteres')
        }
    }

    // Validaciones para password (si se proporciona)
    if (input.password !== undefined) {
        if (input.password.length < 6) {
            return HttpResponse.BadRequest(res, 'La contraseña debe tener al menos 6 caracteres')
        }
        if (input.password.length > 100) {
            return HttpResponse.BadRequest(res, 'La contraseña no puede exceder los 100 caracteres')
        }
    }

    // Validaciones para localty (si se proporciona)
    if (input.localty !== undefined) {
        const zipCodeRegex = /^[0-9]{4,5}$/
        if (!zipCodeRegex.test(input.localty)) {
            return HttpResponse.BadRequest(res, 'El código postal debe contener entre 4 y 5 dígitos numéricos')
        }
    }

    // Validaciones para sellsQuantity (si se proporciona)
    if (input.sellsQuantity !== undefined) {
        if (!Number.isInteger(input.sellsQuantity)) {
            return HttpResponse.BadRequest(res, 'La cantidad de ventas debe ser un número entero')
        }
        if (input.sellsQuantity < 0) {
            return HttpResponse.BadRequest(res, 'La cantidad de ventas no puede ser negativa')
        }
        if (input.sellsQuantity > 100000) {
            return HttpResponse.BadRequest(res, 'La cantidad de ventas no puede ser mayor a 100,000')
        }
    }

    // Validaciones para sellerType (si se proporciona)
    if (input.sellerType !== undefined && input.sellerType.length > 50) {
        return HttpResponse.BadRequest(res, 'El tipo de vendedor no puede exceder los 50 caracteres')
    }

    next()
}

// Middleware para validar ID en parámetros
function validateIdParam(req: Request, res: Response, next: NextFunction) {
    const id = Number.parseInt(req.params.id)
    
    if (isNaN(id) || id <= 0) {
        return HttpResponse.BadRequest(res, 'ID de usuario inválido')
    }
    
    next()
}

// Middleware para validar email en parámetros
function validateEmailParam(req: Request, res: Response, next: NextFunction) {
    const email = req.params.email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(email)) {
        return HttpResponse.BadRequest(res, 'Formato de email inválido')
    }
    
    next()
}

export { 
    sanitizeUserInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam,
    validateEmailParam
}