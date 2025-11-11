import { Request, Response, NextFunction } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'

interface SanitizedPickUpPointInput {
    storeName?: string
    address?: string
    adressDescription?: string
    phoneNumber?: string
    horary?: string
    image?: string
    localty?: number
}

function sanitizePickUpPointInput(req: Request, res: Response, next: NextFunction) {
    console.log('🔍 DEBUG - Body recibido en sanitizePickUpPointInput:', {
        ...req.body,
        imageLength: req.body.image ? req.body.image.length : 0
    })

    // Para crear un nuevo PickUpPoint, localty es obligatorio
    if (req.method === 'POST') {
        if (req.body.localty === undefined || req.body.localty === null) {
            console.log('❌ localty es undefined o null en POST')
            return HttpResponse.BadRequest(res, 'La localidad es requerida')
        }
        
        // Validar que localty sea un número válido
        const localtyId = Number(req.body.localty)
        if (isNaN(localtyId) || localtyId <= 0) {
            console.log('❌ localty no es un número válido:', req.body.localty)
            return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
        }
    }

    const sanitizedInput: SanitizedPickUpPointInput = {
        storeName: typeof req.body.storeName === 'string' ? req.body.storeName.trim() : undefined,
        address: typeof req.body.address === 'string' ? req.body.address.trim() : undefined,
        adressDescription: typeof req.body.adressDescription === 'string' ? req.body.adressDescription.trim() : undefined,
        phoneNumber: typeof req.body.phoneNumber === 'string' ? req.body.phoneNumber.trim() : undefined,
        horary: typeof req.body.horary === 'string' ? req.body.horary.trim() : undefined,
        image: req.body.image, // NO recortar la imagen, es base64
        localty: req.body.localty !== undefined ? Number(req.body.localty) : undefined,
    }

    console.log('🔍 DEBUG - sanitizedInput con imagen:', {
        ...sanitizedInput,
        imageLength: sanitizedInput.image ? sanitizedInput.image.length : 0
    })

    // Eliminar campos undefined (pero mantener localty en creación)
    Object.keys(sanitizedInput).forEach(key => {
        const typedKey = key as keyof SanitizedPickUpPointInput
        if (sanitizedInput[typedKey] === undefined) {
            delete sanitizedInput[typedKey]
        }
    })

    req.body.sanitizedInput = sanitizedInput

    console.log('🔍 DEBUG - sanitizedInput después de limpiar:', {
        ...req.body.sanitizedInput,
        imageLength: req.body.sanitizedInput.image ? req.body.sanitizedInput.image.length : 0
    })

    next()
}

function validateCreatePickUpPointInput(req: Request, res: Response, next: NextFunction) {
    const input: SanitizedPickUpPointInput = req.body.sanitizedInput

    console.log('🔍 DEBUG - Validando creación con input:', {
        ...input,
        imageLength: input.image ? input.image.length : 0
    })

    // Campos obligatorios
    if (!input.address) {
        console.log('❌ Falta address en validación')
        return HttpResponse.BadRequest(res, 'La dirección es requerida')
    }
    if (!input.localty) {
        console.log('❌ Falta localty en validación:', input)
        return HttpResponse.BadRequest(res, 'La localidad es requerida')
    }

    // Validar storeName si está presente
    if (input.storeName && input.storeName.length > 100) {
        return HttpResponse.BadRequest(res, 'El nombre de la tienda no puede exceder los 100 caracteres')
    }

    // Validar dirección
    if (input.address.length < 5) {
        return HttpResponse.BadRequest(res, 'La dirección debe tener al menos 5 caracteres')
    }
    if (input.address.length > 200) {
        return HttpResponse.BadRequest(res, 'La dirección no puede exceder los 200 caracteres')
    }

    // Validar descripción de dirección si está presente
    if (input.adressDescription && input.adressDescription.length > 500) {
        return HttpResponse.BadRequest(res, 'La descripción de dirección no puede exceder los 500 caracteres')
    }

    // Validar phoneNumber si está presente
    if (input.phoneNumber && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(input.phoneNumber)) {
        return HttpResponse.BadRequest(res, 'El número de teléfono no tiene un formato válido')
    }

    // Validar horary si está presente (longitud máxima)
    if (input.horary && input.horary.length > 100) {
        return HttpResponse.BadRequest(res, 'El horario no puede exceder los 100 caracteres')
    }

    // CORRECCIÓN: SOLO UNA VALIDACIÓN DE IMAGEN - eliminar la duplicada
    if (input.image && input.image.length > 10000000) { // ~10MB para base64
        return HttpResponse.BadRequest(res, 'La imagen es demasiado grande')
    }

    // Validar localidad (ID)
    if (isNaN(input.localty) || input.localty <= 0) {
        return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
    }

    console.log('✅ Validación de creación pasada')
    next()
}

function validateUpdatePickUpPointInput(req: Request, res: Response, next: NextFunction) {
    const input: SanitizedPickUpPointInput = req.body.sanitizedInput

    console.log('🔍 DEBUG - Validando actualización con input:', {
        ...input,
        imageLength: input.image ? input.image.length : 0
    })

    const hasFields = Object.keys(input).some(key => {
        const typedKey = key as keyof SanitizedPickUpPointInput
        return input[typedKey] !== undefined
    })
    
    if (!hasFields) {
        return HttpResponse.BadRequest(res, 'Se debe proporcionar al menos un campo para actualizar')
    }

    // Validar storeName si está presente
    if (input.storeName !== undefined && input.storeName !== '' && input.storeName.length > 100) {
        return HttpResponse.BadRequest(res, 'El nombre de la tienda no puede exceder los 100 caracteres')
    }

    // Validar dirección si está presente
    if (input.address !== undefined) {
        if (!input.address || input.address.trim() === '') {
            return HttpResponse.BadRequest(res, 'La dirección no puede estar vacía')
        }
        if (input.address.length < 5) {
            return HttpResponse.BadRequest(res, 'La dirección debe tener al menos 5 caracteres')
        }
        if (input.address.length > 200) {
            return HttpResponse.BadRequest(res, 'La dirección no puede exceder los 200 caracteres')
        }
    }

    // Validar descripción de dirección si está presente
    if (input.adressDescription !== undefined && input.adressDescription.length > 500) {
        return HttpResponse.BadRequest(res, 'La descripción de dirección no puede exceder los 500 caracteres')
    }

    // Validar phoneNumber si está presente
    if (input.phoneNumber !== undefined && input.phoneNumber !== '') {
        if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(input.phoneNumber)) {
            return HttpResponse.BadRequest(res, 'El número de teléfono no tiene un formato válido')
        }
    }

    // Validar horary si está presente
    if (input.horary !== undefined && input.horary.length > 100) {
        return HttpResponse.BadRequest(res, 'El horario no puede exceder los 100 caracteres')
    }

    // Validar imagen si está presente
    if (input.image !== undefined && input.image.length > 5000000) {
        return HttpResponse.BadRequest(res, 'La imagen es demasiado grande')
    }

    // Validar localidad si está presente
    if (input.localty !== undefined) {
        if (isNaN(input.localty) || input.localty <= 0) {
            return HttpResponse.BadRequest(res, 'La localidad debe ser un ID válido')
        }
    }

    console.log('✅ Validación de actualización pasada')
    next()
}

export { 
    sanitizePickUpPointInput, 
    validateCreatePickUpPointInput, 
    validateUpdatePickUpPointInput 
}