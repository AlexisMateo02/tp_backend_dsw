import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { 
    getAllLocalties, 
    getLocaltyByZipcode, 
    createLocalty, 
    updateLocalty, 
    deleteLocalty 
} from './localty.service.js'

async function findAll(req: Request, res: Response) {
    try {
        const localties = await getAllLocalties()
        return HttpResponse.Ok(res, 'Todas las localidades fueron encontradas correctamente', localties)
    } catch (err: any) {
        return HttpResponse.Error(res, 'Fallo al encontrar localidades')
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const zipcode = req.params.zipcode
        const localty = await getLocaltyByZipcode(zipcode)
        return HttpResponse.Ok(res, 'Localidad encontrada correctamente', localty)
    } catch (err: any) {
        if (err.message === 'El código postal es requerido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrada')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('debe contener entre 4 y 5 dígitos numéricos')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al encontrar localidad')
    }
}

async function add(req: Request, res: Response) {
    try {
        const localtyData = req.body.sanitizedInput
        const localty = await createLocalty(localtyData)
        return HttpResponse.Created(res, 'Localidad creada correctamente', localty)
    } catch (err: any) {
        if (err.message.includes('ya existe')) {
            return HttpResponse.DuplicateEntry(res, err.message)
        }
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('El código postal es requerido') || 
            err.message.includes('debe contener entre 4 y 5 dígitos numéricos')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al crear localidad')
    }
}

async function update(req: Request, res: Response) {
    try {
        const zipcode = req.params.zipcode
        const localtyData = req.body.sanitizedInput
        const localty = await updateLocalty(zipcode, localtyData)
        return HttpResponse.Ok(res, 'Localidad actualizada correctamente', localty)
    } catch (err: any) {
        if (err.message.includes('ya existe')) {
            return HttpResponse.DuplicateEntry(res, err.message)
        }
        if (err.message === 'El código postal es requerido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrada')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('debe contener entre 4 y 5 dígitos numéricos')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al actualizar localidad')
    }
}

async function remove(req: Request, res: Response) {
    try {
        const zipcode = req.params.zipcode
        await deleteLocalty(zipcode)
        return HttpResponse.NoContent(res)
    } catch (err: any) {
        if (err.message === 'El código postal es requerido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrada')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('asociados a esta localidad')) {
            return HttpResponse.DuplicateEntry(res, err.message) // Cambiado de Conflict a DuplicateEntry para ser consistentes con Province
        }
        if (err.message.includes('debe contener entre 4 y 5 dígitos numéricos')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al eliminar localidad')
    }
}

export const controllerLocalty = {
    findAll,
    findOne,
    add,
    update,
    remove,
}