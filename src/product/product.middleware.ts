import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { ProductCategory } from './product.entity.js'

function sanitizeProductInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        Productname: typeof req.body.Productname === 'string' ? req.body.Productname.trim() : undefined,
        price: typeof req.body.price === 'string' ? req.body.price.trim() : undefined,
        oldPrice: typeof req.body.oldPrice === 'string' ? req.body.oldPrice.trim() : undefined,
        tag: typeof req.body.tag === 'string' ? req.body.tag.trim() : undefined,
        category: typeof req.body.category === 'string' ? req.body.category.trim() : undefined,
        stock: typeof req.body.stock === 'number' 
            ? req.body.stock 
            : typeof req.body.stock === 'string' 
                ? Number.parseInt(req.body.stock) 
                : undefined,
        image: typeof req.body.image === 'string' ? req.body.image.trim() : undefined,
        secondImage: typeof req.body.secondImage === 'string' ? req.body.secondImage.trim() : undefined,
        thirdImage: typeof req.body.thirdImage === 'string' ? req.body.thirdImage.trim() : undefined,
        fourthImage: typeof req.body.fourthImage === 'string' ? req.body.fourthImage.trim() : undefined,
        description: typeof req.body.description === 'string' ? req.body.description.trim() : undefined,
        includes: typeof req.body.includes === 'string' ? req.body.includes.trim() : undefined,
        kayakTypeId: typeof req.body.kayakTypeId === 'number' 
            ? req.body.kayakTypeId 
            : typeof req.body.kayakTypeId === 'string' 
                ? Number.parseInt(req.body.kayakTypeId) 
                : undefined,
        supTypeId: typeof req.body.supTypeId === 'number' 
            ? req.body.supTypeId 
            : typeof req.body.supTypeId === 'string' 
                ? Number.parseInt(req.body.supTypeId) 
                : undefined,
        boatTypeId: typeof req.body.boatTypeId === 'number' 
            ? req.body.boatTypeId 
            : typeof req.body.boatTypeId === 'string' 
                ? Number.parseInt(req.body.boatTypeId) 
                : undefined,
        articleTypeId: typeof req.body.articleTypeId === 'number' 
            ? req.body.articleTypeId 
            : typeof req.body.articleTypeId === 'string' 
                ? Number.parseInt(req.body.articleTypeId) 
                : undefined,
        sellerId: typeof req.body.sellerId === 'number' 
            ? req.body.sellerId 
            : typeof req.body.sellerId === 'string' 
                ? Number.parseInt(req.body.sellerId) 
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

    // Validar campos requeridos
    if (!input.Productname) return HttpResponse.BadRequest(res, 'El nombre del producto es requerido')
    if (!input.price) return HttpResponse.BadRequest(res, 'El precio es requerido')
    if (!input.category) return HttpResponse.BadRequest(res, 'La categoría es requerida')
    if (!input.image) return HttpResponse.BadRequest(res, 'La imagen principal es requerida')

    // Validaciones para Productname
    if (input.Productname.length < 2) {
        return HttpResponse.BadRequest(res, 'El nombre del producto debe tener al menos 2 caracteres')
    }
    if (input.Productname.length > 200) {
        return HttpResponse.BadRequest(res, 'El nombre del producto no puede exceder los 200 caracteres')
    }

    // Validaciones para price (formato de precio)
    const priceRegex = /^\$?\d+(\.\d{1,2})?$/
    if (!priceRegex.test(input.price.replace(',', '.'))) {
        return HttpResponse.BadRequest(res, 'El precio debe tener un formato válido (ej: 100.00 o $100.00)')
    }

    // Validaciones para oldPrice (si se proporciona)
    if (input.oldPrice && !priceRegex.test(input.oldPrice.replace(',', '.'))) {
        return HttpResponse.BadRequest(res, 'El precio anterior debe tener un formato válido')
    }

    // Validaciones para category
    const validCategories = Object.values(ProductCategory)
    if (!validCategories.includes(input.category as ProductCategory)) {
        return HttpResponse.BadRequest(res, `La categoría debe ser una de: ${validCategories.join(', ')}`)
    }

    // Validaciones para stock (si se proporciona)
    if (input.stock !== undefined) {
        if (!Number.isInteger(input.stock)) {
            return HttpResponse.BadRequest(res, 'El stock debe ser un número entero')
        }
        if (input.stock < 0) {
            return HttpResponse.BadRequest(res, 'El stock no puede ser negativo')
        }
        if (input.stock > 10000) {
            return HttpResponse.BadRequest(res, 'El stock no puede exceder 10,000 unidades')
        }
    }

    // Validaciones para imágenes (longitud de URLs/texto)
    if (input.image.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la imagen principal es demasiado larga')
    }
    if (input.secondImage && input.secondImage.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la segunda imagen es demasiado larga')
    }
    if (input.thirdImage && input.thirdImage.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la tercera imagen es demasiado larga')
    }
    if (input.fourthImage && input.fourthImage.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la cuarta imagen es demasiado larga')
    }

    // Validaciones para descripción e includes
    if (input.description && input.description.length > 2000) {
        return HttpResponse.BadRequest(res, 'La descripción no puede exceder los 2000 caracteres')
    }
    if (input.includes && input.includes.length > 1000) {
        return HttpResponse.BadRequest(res, 'El campo "incluye" no puede exceder los 1000 caracteres')
    }

    // Validaciones para tag
    if (input.tag && input.tag.length > 50) {
        return HttpResponse.BadRequest(res, 'El tag no puede exceder los 50 caracteres')
    }

    // Validaciones específicas por categoría
    if (input.category === ProductCategory.KAYAK && !input.kayakTypeId) {
        return HttpResponse.BadRequest(res, 'Se requiere un tipo de kayak para productos de categoría KAYAK')
    }
    if (input.category === ProductCategory.SUP && !input.supTypeId) {
        return HttpResponse.BadRequest(res, 'Se requiere un tipo de SUP para productos de categoría SUP')
    }
    if (input.category === ProductCategory.EMBARCACION && !input.boatTypeId) {
        return HttpResponse.BadRequest(res, 'Se requiere un tipo de embarcación para productos de categoría EMBARCACION')
    }
    if (input.category === ProductCategory.ARTICULO && !input.articleTypeId) {
        return HttpResponse.BadRequest(res, 'Se requiere un tipo de artículo para productos de categoría ARTICULO')
    }

    // Validaciones para IDs de tipos
    if (input.kayakTypeId && (!Number.isInteger(input.kayakTypeId) || input.kayakTypeId <= 0)) {
        return HttpResponse.BadRequest(res, 'El ID del tipo de kayak debe ser un número entero positivo')
    }
    if (input.supTypeId && (!Number.isInteger(input.supTypeId) || input.supTypeId <= 0)) {
        return HttpResponse.BadRequest(res, 'El ID del tipo de SUP debe ser un número entero positivo')
    }
    if (input.boatTypeId && (!Number.isInteger(input.boatTypeId) || input.boatTypeId <= 0)) {
        return HttpResponse.BadRequest(res, 'El ID del tipo de embarcación debe ser un número entero positivo')
    }
    if (input.articleTypeId && (!Number.isInteger(input.articleTypeId) || input.articleTypeId <= 0)) {
        return HttpResponse.BadRequest(res, 'El ID del tipo de artículo debe ser un número entero positivo')
    }
    if (input.sellerId && (!Number.isInteger(input.sellerId) || input.sellerId <= 0)) {
        return HttpResponse.BadRequest(res, 'El ID del vendedor debe ser un número entero positivo')
    }

    next()
}

function validateUpdateInput(req: Request, res: Response, next: NextFunction) {
    const input = req.body.sanitizedInput

    const hasFields = Object.keys(input).some(key => input[key] !== undefined)
    if (!hasFields) {
        return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
    }

    // Validaciones para Productname (si se proporciona)
    if (input.Productname !== undefined) {
        if (!input.Productname || input.Productname.trim() === '') {
            return HttpResponse.BadRequest(res, 'El nombre del producto no puede estar vacío')
        }
        if (input.Productname.length < 2) {
            return HttpResponse.BadRequest(res, 'El nombre del producto debe tener al menos 2 caracteres')
        }
        if (input.Productname.length > 200) {
            return HttpResponse.BadRequest(res, 'El nombre del producto no puede exceder los 200 caracteres')
        }
    }

    // Validaciones para price (si se proporciona)
    if (input.price !== undefined) {
        const priceRegex = /^\$?\d+(\.\d{1,2})?$/
        if (!priceRegex.test(input.price.replace(',', '.'))) {
            return HttpResponse.BadRequest(res, 'El precio debe tener un formato válido (ej: 100.00 o $100.00)')
        }
    }

    // Validaciones para oldPrice (si se proporciona)
    if (input.oldPrice !== undefined && input.oldPrice !== null && input.oldPrice !== '') {
        const priceRegex = /^\$?\d+(\.\d{1,2})?$/
        if (!priceRegex.test(input.oldPrice.replace(',', '.'))) {
            return HttpResponse.BadRequest(res, 'El precio anterior debe tener un formato válido')
        }
    }

    // Validaciones para category (si se proporciona)
    if (input.category !== undefined) {
        const validCategories = Object.values(ProductCategory)
        if (!validCategories.includes(input.category as ProductCategory)) {
            return HttpResponse.BadRequest(res, `La categoría debe ser una de: ${validCategories.join(', ')}`)
        }
    }

    // Validaciones para stock (si se proporciona)
    if (input.stock !== undefined) {
        if (!Number.isInteger(input.stock)) {
            return HttpResponse.BadRequest(res, 'El stock debe ser un número entero')
        }
        if (input.stock < 0) {
            return HttpResponse.BadRequest(res, 'El stock no puede ser negativo')
        }
        if (input.stock > 10000) {
            return HttpResponse.BadRequest(res, 'El stock no puede exceder 10,000 unidades')
        }
    }

    // Validaciones para imágenes (si se proporcionan)
    if (input.image !== undefined && input.image.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la imagen principal es demasiado larga')
    }
    if (input.secondImage !== undefined && input.secondImage && input.secondImage.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la segunda imagen es demasiado larga')
    }
    if (input.thirdImage !== undefined && input.thirdImage && input.thirdImage.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la tercera imagen es demasiado larga')
    }
    if (input.fourthImage !== undefined && input.fourthImage && input.fourthImage.length > 500) {
        return HttpResponse.BadRequest(res, 'La URL de la cuarta imagen es demasiado larga')
    }

    // Validaciones para descripción e includes (si se proporcionan)
    if (input.description !== undefined && input.description && input.description.length > 2000) {
        return HttpResponse.BadRequest(res, 'La descripción no puede exceder los 2000 caracteres')
    }
    if (input.includes !== undefined && input.includes && input.includes.length > 1000) {
        return HttpResponse.BadRequest(res, 'El campo "incluye" no puede exceder los 1000 caracteres')
    }

    // Validaciones para tag (si se proporciona)
    if (input.tag !== undefined && input.tag && input.tag.length > 50) {
        return HttpResponse.BadRequest(res, 'El tag no puede exceder los 50 caracteres')
    }

    // Validaciones específicas por categoría si se cambia la categoría
    if (input.category !== undefined) {
        if (input.category === ProductCategory.KAYAK && !input.kayakTypeId) {
            return HttpResponse.BadRequest(res, 'Se requiere un tipo de kayak para productos de categoría KAYAK')
        }
        if (input.category === ProductCategory.SUP && !input.supTypeId) {
            return HttpResponse.BadRequest(res, 'Se requiere un tipo de SUP para productos de categoría SUP')
        }
        if (input.category === ProductCategory.EMBARCACION && !input.boatTypeId) {
            return HttpResponse.BadRequest(res, 'Se requiere un tipo de embarcación para productos de categoría EMBARCACION')
        }
        if (input.category === ProductCategory.ARTICULO && !input.articleTypeId) {
            return HttpResponse.BadRequest(res, 'Se requiere un tipo de artículo para productos de categoría ARTICULO')
        }
    }

    // Validaciones para IDs de tipos (si se proporcionan)
    if (input.kayakTypeId !== undefined && input.kayakTypeId !== null) {
        if (!Number.isInteger(input.kayakTypeId) || input.kayakTypeId <= 0) {
            return HttpResponse.BadRequest(res, 'El ID del tipo de kayak debe ser un número entero positivo')
        }
    }
    if (input.supTypeId !== undefined && input.supTypeId !== null) {
        if (!Number.isInteger(input.supTypeId) || input.supTypeId <= 0) {
            return HttpResponse.BadRequest(res, 'El ID del tipo de SUP debe ser un número entero positivo')
        }
    }
    if (input.boatTypeId !== undefined && input.boatTypeId !== null) {
        if (!Number.isInteger(input.boatTypeId) || input.boatTypeId <= 0) {
            return HttpResponse.BadRequest(res, 'El ID del tipo de embarcación debe ser un número entero positivo')
        }
    }
    if (input.articleTypeId !== undefined && input.articleTypeId !== null) {
        if (!Number.isInteger(input.articleTypeId) || input.articleTypeId <= 0) {
            return HttpResponse.BadRequest(res, 'El ID del tipo de artículo debe ser un número entero positivo')
        }
    }
    if (input.sellerId !== undefined && input.sellerId !== null) {
        if (!Number.isInteger(input.sellerId) || input.sellerId <= 0) {
            return HttpResponse.BadRequest(res, 'El ID del vendedor debe ser un número entero positivo')
        }
    }

    next()
}

// Middleware para validar ID en parámetros
function validateIdParam(req: Request, res: Response, next: NextFunction) {
    const id = Number.parseInt(req.params.id)
    
    if (isNaN(id) || id <= 0) {
        return HttpResponse.BadRequest(res, 'ID de producto inválido')
    }
    
    next()
}

// Middleware para validar sellerId en parámetros
function validateSellerIdParam(req: Request, res: Response, next: NextFunction) {
    const sellerId = Number.parseInt(req.params.sellerId)
    
    if (isNaN(sellerId) || sellerId <= 0) {
        return HttpResponse.BadRequest(res, 'ID de vendedor inválido')
    }
    
    next()
}

// Middleware para validar categoría en parámetros
function validateCategoryParam(req: Request, res: Response, next: NextFunction) {
    const category = req.params.category
    const validCategories = Object.values(ProductCategory)
    
    if (!validCategories.includes(category as ProductCategory)) {
        return HttpResponse.BadRequest(res, `Categoría inválida. Debe ser una de: ${validCategories.join(', ')}`)
    }
    
    next()
}

export { 
    sanitizeProductInput, 
    validateCreateInput, 
    validateUpdateInput,
    validateIdParam,
    validateSellerIdParam,
    validateCategoryParam
}