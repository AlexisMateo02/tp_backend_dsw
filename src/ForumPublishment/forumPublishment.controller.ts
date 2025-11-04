import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { 
    getAllForumPublishments, 
    getForumPublishmentById, 
    createForumPublishment, 
    updateForumPublishment, 
    deleteForumPublishment 
} from './forumPublishment.service.js'

async function findAll(req: Request, res: Response) {
    try {
        const publishments = await getAllForumPublishments()
        return HttpResponse.Ok(res, 'Todas las publicaciones del foro fueron encontradas correctamente', publishments)
    } catch (err: any) {
        return HttpResponse.Error(res, 'Fallo al encontrar publicaciones del foro')
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const publishment = await getForumPublishmentById(id)
        return HttpResponse.Ok(res, 'Publicación del foro encontrada correctamente', publishment)
    } catch (err: any) {
        if (err.message === 'ID de publicación inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrada')) {
            return HttpResponse.NotFound(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al encontrar publicación del foro')
    }
}

async function add(req: Request, res: Response) {
    try {
        const publishmentData = req.body.sanitizedInput
        const publishment = await createForumPublishment(publishmentData)
        return HttpResponse.Created(res, 'Publicación del foro creada correctamente', publishment)
    } catch (err: any) {
        if (err.message.includes('Autor no encontrado')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('Datos incompletos')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al crear publicación del foro')
    }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const publishmentData = req.body.sanitizedInput
        const publishment = await updateForumPublishment(id, publishmentData)
        return HttpResponse.Ok(res, 'Publicación del foro actualizada correctamente', publishment)
    } catch (err: any) {
        if (err.message === 'ID de publicación inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrada')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('Autor no encontrado')) {
            return HttpResponse.NotFound(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al actualizar publicación del foro')
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        await deleteForumPublishment(id)
        return HttpResponse.NoContent(res)
    } catch (err: any) {
        if (err.message === 'ID de publicación inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrada')) {
            return HttpResponse.NotFound(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al eliminar publicación del foro')
    }
}

export const controllerForumPublishment = {
    findAll,
    findOne,
    add,
    update,
    remove,
}