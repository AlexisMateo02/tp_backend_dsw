import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllArticleTypes,
	getArticleTypeById,
	createArticleType,
	updateArticleType,
	deleteArticleType,
} from './articleType.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const articleTypes = await getAllArticleTypes()
		return HttpResponse.Ok(res, 'Todos los tipos de artículos fueron encontrados correctamente', articleTypes)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar tipos de artículos')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const articleType = await getArticleTypeById(id)
		return HttpResponse.Ok(res, 'Tipo de artículo encontrado correctamente', articleType)
	} catch (err: any) {
		if (err.message === 'ID de tipo de artículo inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar tipo de artículo')
	}
}

async function add(req: Request, res: Response) {
	try {
		const articleTypeData = req.body.sanitizedInput
		const articleType = await createArticleType(articleTypeData)
		return HttpResponse.Created(res, 'Tipo de artículo creado correctamente', articleType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear tipo de artículo')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const articleTypeData = req.body.sanitizedInput
		const articleType = await updateArticleType(id, articleTypeData)
		return HttpResponse.Ok(res, 'Tipo de artículo actualizado correctamente', articleType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		if (err.message === 'ID de tipo de artículo inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar tipo de artículo')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteArticleType(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de tipo de artículo inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('categoriza')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar tipo de artículo')
	}
}

export const controllerArticleType = {
	findAll,
	findOne,
	add,
	update,
	remove,
}