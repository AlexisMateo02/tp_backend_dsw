import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { 
    getAllPickUpPoints, 
    getPickUpPointById, 
    createPickUpPoint, 
    updatePickUpPoint, 
    deletePickUpPoint,
    getPickUpPointsByLocalty,
    getPickUpPointsByProvince 
} from './pickUpPoint.service.js'

async function findAll(req: Request, res: Response) {
    try {
        const pickUpPoints = await getAllPickUpPoints()
        return HttpResponse.Ok(res, 'Todos los puntos de recogida fueron encontrados correctamente', pickUpPoints)
    } catch (err: any) {
        return HttpResponse.Error(res, 'Fallo al encontrar puntos de recogida')
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const pickUpPoint = await getPickUpPointById(id)
        return HttpResponse.Ok(res, 'Punto de recogida encontrado correctamente', pickUpPoint)
    } catch (err: any) {
        if (err.message === 'ID de punto de recogida inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrado')) {
            return HttpResponse.NotFound(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al encontrar punto de recogida')
    }
}

async function add(req: Request, res: Response) {
    try {
        const pickUpPointData = req.body.sanitizedInput
        const pickUpPoint = await createPickUpPoint(pickUpPointData)
        return HttpResponse.Created(res, 'Punto de recogida creado correctamente', pickUpPoint)
    } catch (err: any) {
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('ya existe')) {
            return HttpResponse.DuplicateEntry(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al crear punto de recogida')
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const pickUpPointData = req.body.sanitizedInput
        const pickUpPoint = await updatePickUpPoint(id, pickUpPointData)
        return HttpResponse.Ok(res, 'Punto de recogida actualizado correctamente', pickUpPoint)
    } catch (err: any) {
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message === 'ID de punto de recogida inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrado')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('ya existe')) {
            return HttpResponse.DuplicateEntry(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al actualizar punto de recogida')
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        await deletePickUpPoint(id)
        return HttpResponse.NoContent(res)
    } catch (err: any) {
        if (err.message === 'ID de punto de recogida inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrado')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('asociadas a este punto de recogida')) {
            return HttpResponse.DuplicateEntry(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al eliminar punto de recogida')
    }
}

// Controladores para las funciones adicionales del servicio

async function findByLocalty(req: Request, res: Response) {
    try {
        const localtyId = Number.parseInt(req.params.id)
        const pickUpPoints = await getPickUpPointsByLocalty(localtyId)
        return HttpResponse.Ok(res, 'Puntos de recogida encontrados correctamente por localidad', pickUpPoints)
    } catch (err: any) {
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('El código postal es requerido') || 
            err.message.includes('debe contener entre 4 y 5 dígitos numéricos')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al buscar puntos de recogida por localidad')
    }
}

async function findByProvince(req: Request, res: Response) {
    try {
        const provinceId = Number.parseInt(req.params.provinceId)
        const pickUpPoints = await getPickUpPointsByProvince(provinceId)
        return HttpResponse.Ok(res, 'Puntos de recogida encontrados correctamente por provincia', pickUpPoints)
    } catch (err: any) {
        if (err.message === 'ID de provincia inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al buscar puntos de recogida por provincia')
    }
}

export const controllerPickUpPoint = {
    findAll,
    findOne,
    add,
    update,
    remove,
    findByLocalty,
    findByProvince
}