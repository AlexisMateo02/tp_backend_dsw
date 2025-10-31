import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import {
	getAllProducts,
	getApprovedProducts,
	getPendingProducts,
	getProductsByCategory,
	getProductsBySeller,
	getProductById,
	createProduct,
	updateProduct,
	approveProduct,
	deleteProduct,
} from './product.service.js'

async function findAll(req: Request, res: Response) {
	try {
		const products = await getAllProducts()
		return HttpResponse.Ok(res, 'Todos los productos fueron encontrados correctamente', products)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar productos')
	}
}

async function findApproved(req: Request, res: Response) {
	try {
		const products = await getApprovedProducts()
		return HttpResponse.Ok(res, 'Productos aprobados encontrados correctamente', products)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar productos aprobados')
	}
}

async function findPending(req: Request, res: Response) {
	try {
		const products = await getPendingProducts()
		return HttpResponse.Ok(res, 'Productos pendientes encontrados correctamente', products)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar productos pendientes')
	}
}

async function findByCategory(req: Request, res: Response) {
	try {
		const category = req.params.category
		const products = await getProductsByCategory(category as any)
		return HttpResponse.Ok(res, `Productos de categoría ${category} encontrados correctamente`, products)
	} catch (err: any) {
		return HttpResponse.Error(res, 'Fallo al encontrar productos por categoría')
	}
}

async function findBySeller(req: Request, res: Response) {
	try {
		const sellerId = Number.parseInt(req.params.sellerId)
		const products = await getProductsBySeller(sellerId)
		return HttpResponse.Ok(res, 'Productos del vendedor encontrados correctamente', products)
	} catch (err: any) {
		if (err.message === 'ID de vendedor inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar productos del vendedor')
	}
}

async function findOne(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const product = await getProductById(id)
		return HttpResponse.Ok(res, 'Producto encontrado correctamente', product)
	} catch (err: any) {
		if (err.message === 'ID de producto inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al encontrar producto')
	}
}

async function add(req: Request, res: Response) {
	try {
		const productData = req.body.sanitizedInput
		const product = await createProduct(productData)
		return HttpResponse.Created(res, 'Producto creado correctamente', product)
	} catch (err: any) {
		if (err.message.includes('Se requiere')) {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no existe') || err.message.includes('no es válido')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al crear producto')
	}
}

async function update(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const productData = req.body.sanitizedInput
		const product = await updateProduct(id, productData)
		return HttpResponse.Ok(res, 'Producto actualizado correctamente', product)
	} catch (err: any) {
		if (err.message === 'ID de producto inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('Se requiere')) {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado') || err.message.includes('no existe')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al actualizar producto')
	}
}

async function approve(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		const product = await approveProduct(id)
		return HttpResponse.Ok(res, 'Producto aprobado correctamente', product)
	} catch (err: any) {
		if (err.message === 'ID de producto inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al aprobar producto')
	}
}

async function remove(req: Request, res: Response) {
	try {
		const id = Number.parseInt(req.params.id)
		await deleteProduct(id)
		return HttpResponse.NoContent(res)
	} catch (err: any) {
		if (err.message === 'ID de producto inválido') {
			return HttpResponse.BadRequest(res, err.message)
		}
		if (err.message.includes('no fue encontrado')) {
			return HttpResponse.NotFound(res, err.message)
		}
		if (err.message.includes('incluido en')) {
			return HttpResponse.Conflict(res, err.message)
		}
		return HttpResponse.Error(res, 'Fallo al eliminar producto')
	}
}

export const controllerProduct = {
	findAll,
	findApproved,
	findPending,
	findByCategory,
	findBySeller,
	findOne,
	add,
	update,
	approve,
	remove,
}
