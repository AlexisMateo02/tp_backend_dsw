import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllPickUpPoints,
	getActivePickUpPoints,
	getPickUpPointById,
	getPickUpPointsByLocalty,
	createPickUpPoint,
	updatePickUpPoint,
	deletePickUpPoint,
} from './pickUpPoint.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const pickUpPoints = await getAllPickUpPoints()
		return HttpResponse.Ok(res, 'Todos los puntos de retiro fueron encontrados correctamente', pickUpPoints)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar puntos de retiro')
	}
}

async function findActive(req: Request, res: Response) {
	try {
		const pickUpPoints = await getActivePickUpPoints()
		return HttpResponse.Ok(res, 'Puntos de retiro activos encontrados correctamente', pickUpPoints)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar puntos de retiro activos')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const pickUpPoint = await getPickUpPointById(id)
		return HttpResponse.Ok(res, 'Punto de retiro encontrado correctamente', pickUpPoint)
	} catch (err: any) {
		if (err.message === 'ID de punto de retiro inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar punto de retiro')
	}
}

async function findByLocalty(req: Request, res: Response) {
	try {
		const localtyId = Number.parseInt(req.params.localtyId)
		const pickUpPoints = await getPickUpPointsByLocalty(localtyId)
		return HttpResponse.Ok(res, 'Puntos de retiro de la localidad encontrados correctamente', pickUpPoints)
	} catch (err: any) {
		if (err.message === 'ID de localidad inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar puntos de retiro de la localidad')
	}
}

async function add(req: Request, res: Response) {
	try {
		const pickUpPointData = req.body.sanitizedInput
		const pickUpPoint = await createPickUpPoint(pickUpPointData)
		return HttpResponse.Created(res, 'Punto de retiro creado correctamente', pickUpPoint)
	} catch (err: any) {
		if (err.message.includes('no existe')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear punto de retiro')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const pickUpPointData = req.body.sanitizedInput
		const pickUpPoint = await updatePickUpPoint(id, pickUpPointData)
		return HttpResponse.Ok(res, 'Punto de retiro actualizado correctamente', pickUpPoint)
	} catch (err: any) {
		if (err.message === 'ID de punto de retiro inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado') || err.message.includes('no existe')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar punto de retiro')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deletePickUpPoint(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de punto de retiro inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar punto de retiro')
	}
}

export const controllerPickUpPoint = {
	findAll,
	findActive,
	findOne,
	findByLocalty,
	add,
	update,
	remove,
}
