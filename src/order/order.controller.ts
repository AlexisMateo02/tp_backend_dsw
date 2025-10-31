import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllOrders,
	getOrderById,
	getOrdersByUser,
	createOrder,
	updateOrderStatus,
	deleteOrder,
} from './order.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const orders = await getAllOrders()
		return HttpResponse.Ok(res, 'Todas las órdenes fueron encontradas correctamente', orders)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar órdenes')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const order = await getOrderById(id)
		return HttpResponse.Ok(res, 'Orden encontrada correctamente', order)
	} catch (err: any) {
		if (err.message === 'ID de orden inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar orden')
	}
}

async function findByUser(req: Request, res: Response) {
	try {
		const userId = Number.parseInt(req.params.userId)
		const orders = await getOrdersByUser(userId)
		return HttpResponse.Ok(res, 'Órdenes del usuario encontradas correctamente', orders)
	} catch (err: any) {
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar órdenes del usuario')
	}
}

async function add(req: Request, res: Response) {
	try {
		const orderData = req.body.sanitizedInput
		const order = await createOrder(orderData)
		return HttpResponse.Created(res, 'Orden creada correctamente', order)
	} catch (err: any) {
		if (err.message.includes('no encontrado') || err.message === 'Usuario no encontrado') {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('Stock insuficiente')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear orden')
	}
}

async function updateStatus(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const { status } = req.body.sanitizedInput
		const order = await updateOrderStatus(id, status)
		return HttpResponse.Ok(res, 'Estado de orden actualizado correctamente', order)
	} catch (err: any) {
		if (err.message === 'ID de orden inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar estado de orden')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteOrder(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de orden inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrada')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar orden')
	}
}

export const controllerOrder = {
	findAll,
	findOne,
	findByUser,
	add,
	updateStatus,
	remove,
}
