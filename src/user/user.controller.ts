import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getUserByEmail,
	getUsersByLocalty,
	getUserStats,
	getUserRatingsReceived,
	getUserRatingsGiven,
	incrementUserSells,
} from './user.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const users = await getAllUsers()
		return HttpResponse.Ok(res, 'Todos los usuarios fueron encontrados correctamente', users)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar usuarios')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const user = await getUserById(id)
		return HttpResponse.Ok(res, 'Usuario encontrado correctamente', user)
	} catch (err: any) {
		
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar usuario')
	}
}

async function add(req: Request, res: Response) {
	try {
		const userData = req.body.sanitizedInput
		const user = await createUser(userData)
		return HttpResponse.Created(res, 'Usuario creado correctamente', user)
	} catch (err: any) {
		
		if (err.message.includes('no existe')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('Ya existe')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear usuario')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const userData = req.body.sanitizedInput
		const user = await updateUser(id, userData)
		return HttpResponse.Ok(res, 'Usuario actualizado correctamente', user)
	} catch (err: any) {
		
		if (err.message.includes('no existe')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('ya existe')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar usuario')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteUser(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('publicaciones activas') || err.message.includes('compras pendientes')) {
			return HttpResponse.DuplicateEntry(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar usuario')
	}
}

// Controladores para las funciones adicionales
async function findByEmail(req: Request, res: Response) {
	try {
		const email = req.params.email
		const user = await getUserByEmail(email)
		return HttpResponse.Ok(res, 'Usuario encontrado correctamente por email', user)
	} catch (err: any) {
		
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al buscar usuario por email')
	}
}

async function findByLocalty(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const users = await getUsersByLocalty(id)
		return HttpResponse.Ok(res, 'Usuarios encontrados correctamente por localidad', users)
	} catch (err: any) {
		
		if (err.message.includes('no existe')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al buscar usuarios por localidad')
	}
}

async function getStats(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const stats = await getUserStats(id)
		return HttpResponse.Ok(res, 'Estadísticas del usuario obtenidas correctamente', stats)
	} catch (err: any) {

		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al obtener estadísticas del usuario')
	}
}

async function getRatingsReceived(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const ratings = await getUserRatingsReceived(id)
		return HttpResponse.Ok(res, 'Ratings recibidos obtenidos correctamente', ratings)
	} catch (err: any) {
		
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al obtener ratings recibidos')
	}
}

async function getRatingsGiven(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const ratings = await getUserRatingsGiven(id)
		return HttpResponse.Ok(res, 'Ratings dados obtenidos correctamente', ratings)
	} catch (err: any) {
	
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al obtener ratings dados')
	}
}

async function incrementSells(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const user = await incrementUserSells(id)
		return HttpResponse.Ok(res, 'Ventas incrementadas correctamente', user)
	} catch (err: any) {
	
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al incrementar ventas')
	}
}

export const controllerUser = {
	findAll,
	findOne,
	add,
	update,
	remove,
	findByEmail,
	findByLocalty,
	getStats,
	getRatingsReceived,
	getRatingsGiven,
	incrementSells,
}
