import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllKayakTypes,
	getKayakTypeById,
	createKayakType,
	updateKayakType,
	deleteKayakType,
} from './kayakType.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const kayakTypes = await getAllKayakTypes()
		return HttpResponse.Ok(res, 'Todos los tipos de kayaks fueron encontrados correctamente', kayakTypes)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar tipos de kayaks')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const kayakType = await getKayakTypeById(id)
		return HttpResponse.Ok(res, 'Tipo de kayak encontrado correctamente', kayakType)
	} catch (err: any) {
		if (err.message === 'ID de tipo de kayak inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar tipo de kayak')
	}
}

async function add(req: Request, res: Response) {
	try {
		const kayakTypeData = req.body.sanitizedInput
		const kayakType = await createKayakType(kayakTypeData)
		return HttpResponse.Created(res, 'Tipo de kayak creado correctamente', kayakType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear tipo de kayak')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const kayakTypeData = req.body.sanitizedInput
		const kayakType = await updateKayakType(id, kayakTypeData)
		return HttpResponse.Ok(res, 'Tipo de kayak actualizado correctamente', kayakType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		if (err.message === 'ID de tipo de kayak inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar tipo de kayak')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteKayakType(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de tipo de kayak inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('categoriza')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar tipo de kayak')
	}
}

export const controllerKayakType = {
	findAll,
	findOne,
	add,
	update,
	remove,
}
