import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { getAllLocalties, getLocaltyById, createLocalty, updateLocalty, deleteLocalty } from './localty.service.js'

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
		const id = Number.parseInt(req.params.id)
		const localty = await getLocaltyById(id)
		return HttpResponse.Ok(res, 'Localidad encontrada correctamente', localty)
	} catch (err: any) {
		if (err.message === 'ID de localidad inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
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
		return HttpResponse.Error(res, 'Fallo al crear localidad')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const localtyData = req.body.sanitizedInput
		const localty = await updateLocalty(id, localtyData)
		return HttpResponse.Ok(res, 'Localidad actualizada correctamente', localty)
	} catch (err: any) {
		if (err.message === 'ID de localidad inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('ya existe')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('no existe')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar localidad')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteLocalty(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de localidad inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('asociados a esta localidad')) {
			return HttpResponse.DuplicateEntry(res, err.message)
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
