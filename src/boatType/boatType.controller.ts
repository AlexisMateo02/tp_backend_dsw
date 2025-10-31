import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { getAllBoatTypes, getBoatTypeById, createBoatType, updateBoatType, deleteBoatType } from './boatType.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const boatTypes = await getAllBoatTypes()
		return HttpResponse.Ok(res, 'Todos los tipos de embarcaciones fueron encontrados correctamente', boatTypes)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar tipos de embarcaciones')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const boatType = await getBoatTypeById(id)
		return HttpResponse.Ok(res, 'Tipo de embarcación encontrado correctamente', boatType)
	} catch (err: any) {
		if (err.message === 'ID de tipo de embarcación inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar tipo de embarcación')
	}
}

async function add(req: Request, res: Response) {
	try {
		const boatTypeData = req.body.sanitizedInput
		const boatType = await createBoatType(boatTypeData)
		return HttpResponse.Created(res, 'Tipo de embarcación creado correctamente', boatType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear tipo de embarcación')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const boatTypeData = req.body.sanitizedInput
		const boatType = await updateBoatType(id, boatTypeData)
		return HttpResponse.Ok(res, 'Tipo de embarcación actualizado correctamente', boatType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.Conflict(res, err.message)
		}
		if (err.message === 'ID de tipo de embarcación inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar tipo de embarcación')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteBoatType(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de tipo de embarcación inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('categoriza')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar tipo de embarcación')
	}
}

export const controllerBoatType = {
	findAll,
	findOne,
	add,
	update,
	remove,
}
