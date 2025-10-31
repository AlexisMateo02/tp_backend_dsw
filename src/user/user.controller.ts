import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllUsers,
	getUserById,
	getUserByEmail,
	createUser,
	registerSeller,
	updateUser,
	verifySeller,
	deleteUser,
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

async function registerAsSellerHandler(req: Request, res: Response) {
	try {
		const sellerData = req.body.sanitizedInput
		const seller = await registerSeller(sellerData)
		return HttpResponse.Created(res, 'Vendedor registrado correctamente', seller)
	} catch (err: any) {
		if (err.message.includes('ya está registrado')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al registrar vendedor')
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

async function verify(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const seller = await verifySeller(id)
		return HttpResponse.Ok(res, 'Vendedor verificado correctamente', seller)
	} catch (err: any) {
		if (err.message === 'ID de usuario inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message === 'El usuario no es un vendedor') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al verificar vendedor')
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
		if (err.message.includes('orden') || err.message.includes('producto')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar usuario')
	}
}

export const controllerUser = {
	findAll,
	findOne,
	findByEmail,
	register,
	registerAsSellerHandler,
	update,
	verify,
	remove,
}
