import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

function sanitizeProductInput(req: Request, res: Response, next: NextFunction) {
    const sanitizedInput: any = {}

    // Sanitizar campos de texto
    if (typeof req.body.name === 'string') {
        sanitizedInput.name = req.body.name.trim()
    }
    if (typeof req.body.description === 'string') {
        sanitizedInput.description = req.body.description.trim()
    }

    // Sanitizar números
    if (req.body.price !== undefined && req.body.price !== null && req.body.price !== '') {
        const price = Number(req.body.price)
        if (!isNaN(price)) {
            sanitizedInput.price = price
        }
    }

    if (req.body.quantity !== undefined && req.body.quantity !== null && req.body.quantity !== '') {
        const quantity = Number(req.body.quantity)
        if (!isNaN(quantity)) {
            sanitizedInput.quantity = quantity
        }
    }

    // Sanitizar relaciones
    if (req.body.publishment !== undefined && req.body.publishment !== null && req.body.publishment !== '') {
        const publishment = Number(req.body.publishment)
        if (!isNaN(publishment)) {
            sanitizedInput.publishment = publishment
        }
    }

    // Manejar tipos opcionales (pueden ser null)
    if (req.body.articleType !== undefined) {
        if (req.body.articleType === null || req.body.articleType === '') {
            sanitizedInput.articleType = null
        } else {
            const articleType = Number(req.body.articleType)
            if (!isNaN(articleType)) {
                sanitizedInput.articleType = articleType
            }
        }
    }

    if (req.body.kayakType !== undefined) {
        if (req.body.kayakType === null || req.body.kayakType === '') {
            sanitizedInput.kayakType = null
        } else {
            const kayakType = Number(req.body.kayakType)
            if (!isNaN(kayakType)) {
                sanitizedInput.kayakType = kayakType
            }
        }
    }

    req.body.sanitizedInput = sanitizedInput
    next()
}

function validateCreateInput(req: Request, res: Response, next: NextFunction) {
    const input = req.body.sanitizedInput

    // Validar campos requeridos
    if (!input.name || input.name.trim() === '') {
        return HttpResponse.BadRequest(res, 'El nombre es requerido')
    }
    if (!input.description || input.description.trim() === '') {
        return HttpResponse.BadRequest(res, 'La descripción es requerida')
    }
    if (input.price === undefined || input.price === null) {
        return HttpResponse.BadRequest(res, 'El precio es requerido')
    }
    if (input.quantity === undefined || input.quantity === null) {
        return HttpResponse.BadRequest(res, 'La cantidad es requerida')
    }
    if (!input.publishment) {
        return HttpResponse.BadRequest(res, 'La publicación es requerida')
    }

    // Validar que al menos un tipo esté presente
    const hasArticleType = input.articleType !== undefined && input.articleType !== null
    const hasKayakType = input.kayakType !== undefined && input.kayakType !== null
    
    if (!hasArticleType && !hasKayakType) {
        return HttpResponse.BadRequest(res, 'El producto debe tener al menos un tipo de artículo o un tipo de kayak')
    }

    // Validaciones para name
    if (input.name.length < 2) {
        return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
    }
    if (input.name.length > 100) {
        return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
    }

    // Validaciones para description
    if (input.description.length < 10) {
        return HttpResponse.BadRequest(res, 'La descripción debe tener al menos 10 caracteres')
    }
    if (input.description.length > 1000) {
        return HttpResponse.BadRequest(res, 'La descripción no puede exceder los 1000 caracteres')
    }

    // Validaciones para price
    if (typeof input.price !== 'number') {
        return HttpResponse.BadRequest(res, 'El precio debe ser un número válido')
    }
    if (input.price <= 0) {
        return HttpResponse.BadRequest(res, 'El precio debe ser mayor a 0')
    }
    if (input.price > 1000000) {
        return HttpResponse.BadRequest(res, 'El precio no puede ser mayor a 1,000,000')
    }
    // Validar decimales en precio
    if (!/^\d+(\.\d{1,2})?$/.test(input.price.toString())) {
        return HttpResponse.BadRequest(res, 'El precio puede tener hasta 2 decimales')
    }

    // Validaciones para quantity
    if (!Number.isInteger(input.quantity)) {
        return HttpResponse.BadRequest(res, 'La cantidad debe ser un número entero')
    }
    if (input.quantity < 0) {
        return HttpResponse.BadRequest(res, 'La cantidad no puede ser negativa')
    }
    if (input.quantity > 10000) {
        return HttpResponse.BadRequest(res, 'La cantidad no puede ser mayor a 10,000')
    }

    // Validar tipos si se proporcionan
    if (hasArticleType && (!Number.isInteger(input.articleType) || input.articleType <= 0)) {
        return HttpResponse.BadRequest(res, 'El tipo de artículo debe ser un ID válido')
    }
    if (hasKayakType && (!Number.isInteger(input.kayakType) || input.kayakType <= 0)) {
        return HttpResponse.BadRequest(res, 'El tipo de kayak debe ser un ID válido')
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

    // Validaciones para name (si se proporciona)
    if (input.name !== undefined) {
        if (!input.name || input.name.trim() === '') {
            return HttpResponse.BadRequest(res, 'El nombre no puede estar vacío')
        }
        if (input.name.length < 2) {
            return HttpResponse.BadRequest(res, 'El nombre debe tener al menos 2 caracteres')
        }
        if (input.name.length > 100) {
            return HttpResponse.BadRequest(res, 'El nombre no puede exceder los 100 caracteres')
        }
    }

    // Validaciones para description (si se proporciona)
    if (input.description !== undefined) {
        if (!input.description || input.description.trim() === '') {
            return HttpResponse.BadRequest(res, 'La descripción no puede estar vacía')
        }
        if (input.description.length < 10) {
            return HttpResponse.BadRequest(res, 'La descripción debe tener al menos 10 caracteres')
        }
        if (input.description.length > 1000) {
            return HttpResponse.BadRequest(res, 'La descripción no puede exceder los 1000 caracteres')
        }
    }

    // Validaciones para price (si se proporciona)
    if (input.price !== undefined) {
        if (typeof input.price !== 'number') {
            return HttpResponse.BadRequest(res, 'El precio debe ser un número válido')
        }
        if (input.price <= 0) {
            return HttpResponse.BadRequest(res, 'El precio debe ser mayor a 0')
        }
        if (input.price > 1000000) {
            return HttpResponse.BadRequest(res, 'El precio no puede ser mayor a 1,000,000')
        }
        if (!/^\d+(\.\d{1,2})?$/.test(input.price.toString())) {
            return HttpResponse.BadRequest(res, 'El precio puede tener hasta 2 decimales')
        }
    }

    // Validaciones para quantity (si se proporciona)
    if (input.quantity !== undefined) {
        if (!Number.isInteger(input.quantity)) {
            return HttpResponse.BadRequest(res, 'La cantidad debe ser un número entero')
        }
        if (input.quantity < 0) {
            return HttpResponse.BadRequest(res, 'La cantidad no puede ser negativa')
        }
        if (input.quantity > 10000) {
            return HttpResponse.BadRequest(res, 'La cantidad no puede ser mayor a 10,000')
        }
    }

    // Validar que no se eliminen ambos tipos
    const articleTypeChanging = input.articleType !== undefined
    const kayakTypeChanging = input.kayakType !== undefined
    
    if (articleTypeChanging && kayakTypeChanging && input.articleType === null && input.kayakType === null) {
        return HttpResponse.BadRequest(res, 'El producto debe tener al menos un tipo de artículo o un tipo de kayak')
    }

    // Validar tipos si se proporcionan
    if (input.articleType !== undefined && input.articleType !== null) {
        if (!Number.isInteger(input.articleType) || input.articleType <= 0) {
            return HttpResponse.BadRequest(res, 'El tipo de artículo debe ser un ID válido')
        }
    }
    if (input.kayakType !== undefined && input.kayakType !== null) {
        if (!Number.isInteger(input.kayakType) || input.kayakType <= 0) {
            return HttpResponse.BadRequest(res, 'El tipo de kayak debe ser un ID válido')
        }
    }

    next()
}

// Middleware adicional para validar ID en parámetros
function validateIdParam(req: Request, res: Response, next: NextFunction) {
    const id = Number.parseInt(req.params.id)
    
    if (isNaN(id) || id <= 0) {
        return HttpResponse.BadRequest(res, 'ID de producto inválido')
    }
    
    next()
}

export { 
    sanitizeProductInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam 
}