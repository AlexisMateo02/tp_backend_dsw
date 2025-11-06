import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllUsers,
	getUserById,
	getUserByEmail,
	createUser,
	updateUser,
	deleteUser,
	changeThePassword,
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

async function findByEmail(req: Request, res: Response) {
	try {
		const email = req.params.email
		const user = await getUserByEmail(email)
		return HttpResponse.Ok(res, 'Usuario encontrado correctamente', user)
	} catch (err: any) {
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar usuario')
	}
}

async function register(req: Request, res: Response) {
	try {
		const userData = req.body.sanitizedInput
		const user = await createUser(userData)
		return HttpResponse.Created(res, 'Usuario registrado correctamente', user)
	} catch (err: any) {
		if (err.message.includes('ya está registrado')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al registrar usuario')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const userData = req.body.sanitizedInput
		const user = await updateUser(id, userData)
		return HttpResponse.Ok(res, 'Usuario actualizado correctamente', user)
	} catch (err: any) {
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('ya está registrado')) {
			return HttpResponse.Conflict(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
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
		if (err.message.includes('orden')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar usuario')
	}
}

async function changePassword(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const { currentPassword, newPassword } = req.body

		if (!currentPassword || !newPassword) {
			return HttpResponse.BadRequest(res, 'Contraseña actual y nueva contraseña son requeridas')
		}

		if (newPassword.length < 6) {
			return HttpResponse.BadRequest(res, 'La nueva contraseña debe tener al menos 6 caracteres')
		}

		const user = await changeThePassword(id, currentPassword, newPassword)
		return HttpResponse.Ok(res, 'Contraseña actualizada correctamente')
	} catch (err: any) {
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('contraseña actual')) {
			return HttpResponse.BadRequest(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al cambiar contraseña')
	}
}

export const controllerUser = {
	findAll,
	findOne,
	findByEmail,
	register,
	update,
	remove,
	changePassword,
}
