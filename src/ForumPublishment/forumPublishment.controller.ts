import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllForumPublishments,
	getForumPublishmentById,
	createForumPublishment,
	updateForumPublishment,
	deleteForumPublishment,
	getForumPublishmentsByStatus,
	getActiveForumPublishments,
	getSoldForumPublishments,
} from './forumPublishment.service.js'
import { PublicationStatus } from './forumPublishment.entity.js'

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

// NUEVAS FUNCIONES PARA FILTRADO
async function findByStatus(req: Request, res: Response) {
	try {
		const status = req.params.status as PublicationStatus
		const publishments = await getForumPublishmentsByStatus(status)
		return HttpResponse.Ok(res, `Publicaciones con estado ${status} encontradas correctamente`, publishments)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar publicaciones por estado')
	}
}

async function findActive(req: Request, res: Response) {
	try {
		const publishments = await getActiveForumPublishments()
		return HttpResponse.Ok(res, 'Publicaciones activas encontradas correctamente', publishments)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar publicaciones activas')
	}
}

async function findSold(req: Request, res: Response) {
	try {
		const publishments = await getSoldForumPublishments()
		return HttpResponse.Ok(res, 'Publicaciones vendidas encontradas correctamente', publishments)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar publicaciones vendidas')
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

async function uploadImage(req: Request, res: Response) {
	try {
		if (!req.file) {
			return HttpResponse.BadRequest(res, 'No se subió ninguna imagen')
		}

		const imageUrl = `/uploads/forum/${req.file.filename}`
		return HttpResponse.Ok(res, 'Imagen subida correctamente', { imageUrl })
	} catch (err: any) {
		return HttpResponse.Error(res, 'Error al subir la imagen')
	}
}

export const controllerForumPublishment = {
	findAll,
	findOne,
	findByStatus,
	findActive,
	findSold,
	add,
	update,
	remove,
	uploadImage,
}
