import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { getAllSUPTypes, getSUPTypeById, createSUPType, updateSUPType, deleteSUPType } from './supType.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const supTypes = await getAllSUPTypes()
		return HttpResponse.Ok(res, 'Todos los tipos de SUP fueron encontrados correctamente', supTypes)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar tipos de SUP')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const supType = await getSUPTypeById(id)
		return HttpResponse.Ok(res, 'Tipo de SUP encontrado correctamente', supType)
	} catch (err: any) {
		if (err.message === 'ID de tipo de SUP inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar tipo de SUP')
	}
}

async function add(req: Request, res: Response) {
	try {
		const supTypeData = req.body.sanitizedInput
		const supType = await createSUPType(supTypeData)
		return HttpResponse.Created(res, 'Tipo de SUP creado correctamente', supType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear tipo de SUP')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const supTypeData = req.body.sanitizedInput
		const supType = await updateSUPType(id, supTypeData)
		return HttpResponse.Ok(res, 'Tipo de SUP actualizado correctamente', supType)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.Conflict(res, err.message)
		}
		if (err.message === 'ID de tipo de SUP inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar tipo de SUP')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteSUPType(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de tipo de SUP inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('categoriza')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar tipo de SUP')
	}
}

export const controllerSUPType = {
	findAll,
	findOne,
	add,
	update,
	remove,
}
