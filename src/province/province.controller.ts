import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { getAllProvinces, getProvinceById, createProvince, updateProvince, deleteProvince } from './province.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const provinces = await getAllProvinces()
		return HttpResponse.Ok(res, 'Todas las provincias fueron encontradas correctamente', provinces)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar provincias')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const province = await getProvinceById(id)
		return HttpResponse.Ok(res, 'Provincia encontrada correctamente', province)
	} catch (err: any) {
		if (err.message === 'ID de provincia inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar provincia')
	}
}

async function add(req: Request, res: Response) {
	try {
		const provinceData = req.body.sanitizedInput
		const province = await createProvince(provinceData)
		return HttpResponse.Created(res, 'Provincia creada correctamente', province)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear provincia')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const provinceData = req.body.sanitizedInput
		const province = await updateProvince(id, provinceData)
		return HttpResponse.Ok(res, 'Provincia actualizada correctamente', province)
	} catch (err: any) {
		if (err.message.includes('ya existe')) {
			return HttpResponse.Conflict(res, err.message)
		}
		if (err.message === 'ID de provincia inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar provincia')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteProvince(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de provincia inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('se ubican')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar provincia')
	}
}

export const controllerProvince = {
	findAll,
	findOne,
	add,
	update,
	remove,
}
