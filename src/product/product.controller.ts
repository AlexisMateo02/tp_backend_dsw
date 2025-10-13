import { Request, Response } from 'express'
import { HttpResponse } from '../shared/errors/errorManager.js'
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getProductsByPublishment,
    getProductsByArticleType,
    getProductsByKayakType
} from './product.service.js'

async function findAll(req: Request, res: Response) {
    try {
        const products = await getAllProducts()
        return HttpResponse.Ok(res, 'Todos los productos fueron encontrados correctamente', products)
    } catch (err: any) {
        console.error('Error en findAll products:', err)
        return HttpResponse.Error(res, 'Fallo al encontrar productos')
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const product = await getProductById(id)
        return HttpResponse.Ok(res, 'Producto encontrado correctamente', product)
    } catch (err: any) {
        console.error('Error en findOne product:', err)
        
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
        console.error('Error en add product:', err)
        
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('ya existe')) {
            return HttpResponse.DuplicateEntry(res, err.message)
        }
        if (err.message.includes('debe tener al menos un tipo')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('El precio puede tener hasta 2 decimales')) {
            return HttpResponse.BadRequest(res, err.message)
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
        console.error('Error en update product:', err)
        
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message === 'ID de producto inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrado')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message.includes('ya existe')) {
            return HttpResponse.DuplicateEntry(res, err.message)
        }
        if (err.message.includes('debe tener al menos un tipo')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('El precio puede tener hasta 2 decimales')) {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al actualizar producto')
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        await deleteProduct(id)
        return HttpResponse.NoContent(res)
    } catch (err: any) {
        console.error('Error en remove product:', err)
        
        if (err.message === 'ID de producto inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no fue encontrado')) {
            return HttpResponse.NotFound(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al eliminar producto')
    }
}

// Controladores para las funciones adicionales
async function findByPublishment(req: Request, res: Response) {
    try {
        const publishmentId = Number.parseInt(req.params.publishmentId)
        const products = await getProductsByPublishment(publishmentId)
        return HttpResponse.Ok(res, 'Productos encontrados correctamente por publicación', products)
    } catch (err: any) {
        console.error('Error en findByPublishment:', err)
        
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        if (err.message === 'ID de publicación inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al buscar productos por publicación')
    }
}

async function findByArticleType(req: Request, res: Response) {
    try {
        const articleTypeId = Number.parseInt(req.params.articleTypeId)
        const products = await getProductsByArticleType(articleTypeId)
        return HttpResponse.Ok(res, 'Productos encontrados correctamente por tipo de artículo', products)
    } catch (err: any) {
        console.error('Error en findByArticleType:', err)
        
        if (err.message === 'ID de tipo de artículo inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al buscar productos por tipo de artículo')
    }
}

async function findByKayakType(req: Request, res: Response) {
    try {
        const kayakTypeId = Number.parseInt(req.params.kayakTypeId)
        const products = await getProductsByKayakType(kayakTypeId)
        return HttpResponse.Ok(res, 'Productos encontrados correctamente por tipo de kayak', products)
    } catch (err: any) {
        console.error('Error en findByKayakType:', err)
        
        if (err.message === 'ID de tipo de kayak inválido') {
            return HttpResponse.BadRequest(res, err.message)
        }
        if (err.message.includes('no existe')) {
            return HttpResponse.NotFound(res, err.message)
        }
        return HttpResponse.Error(res, 'Fallo al buscar productos por tipo de kayak')
    }
}

export const controllerProduct = {
    findAll,
    findOne,
    add,
    update,
    remove,
    findByPublishment,
    findByArticleType,
    findByKayakType
}