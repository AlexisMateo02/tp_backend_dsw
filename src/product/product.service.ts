import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { Product } from './product.entity.js'
import { ArticleType } from '../articleType/articleType.entity.js'
import { KayakType } from '../kayakType/kayakType.entity.js'
import { Publishment } from '../publishment/publishment.entity.js'

const entityManager = orm.em

interface ProductCreateData {
    name: string
    description: string
    price: number
    quantity: number
    articleType?: number | null
    kayakType?: number | null
    publishment: number
}

interface ProductUpdateData extends Partial<Omit<ProductCreateData, 'publishment'>> {
    publishment?: number
}

export async function getAllProducts() {
    return await entityManager.find(
        Product,
        {},
        { 
            populate: ['articleType', 'kayakType', 'publishment'],
            orderBy: { id: 'ASC' }
        }
    )
}

export async function getProductById(id: number) {
    validateId(id, 'producto')
    
    const product = await entityManager.findOne(
        Product,
        { id },
        { 
            populate: ['articleType', 'kayakType', 'publishment'] 
        }
    )
    
    if (!product) {
        throw new Error(`El producto con el ID ${id} no fue encontrado`)
    }
    return product
}

export async function createProduct(productData: ProductCreateData) {
    // Validar que la publicación existe
    const publishment = await entityManager.findOne(Publishment, { id: productData.publishment })
    if (!publishment) {
        throw new Error(`La publicación con ID ${productData.publishment} no existe`)
    }

    // Validar que al menos uno de los tipos esté presente y no sean ambos null
    const hasArticleType = productData.articleType !== undefined && productData.articleType !== null
    const hasKayakType = productData.kayakType !== undefined && productData.kayakType !== null
    
    if (!hasArticleType && !hasKayakType) {
        throw new Error('El producto debe tener al menos un tipo de artículo o un tipo de kayak')
    }

    // Validar articleType si se proporciona
    let articleTypeEntity = undefined
    if (hasArticleType) {
        articleTypeEntity = await entityManager.findOne(ArticleType, { id: productData.articleType! })
        if (!articleTypeEntity) {
            throw new Error(`El tipo de artículo con ID ${productData.articleType} no existe`)
        }
    }

    // Validar kayakType si se proporciona
    let kayakTypeEntity = undefined
    if (hasKayakType) {
        kayakTypeEntity = await entityManager.findOne(KayakType, { id: productData.kayakType! })
        if (!kayakTypeEntity) {
            throw new Error(`El tipo de kayak con ID ${productData.kayakType} no existe`)
        }
    }

    // Validar que no existe un producto con el mismo nombre en la misma publicación
    const existingProduct = await entityManager.findOne(Product, {
        name: productData.name,
        publishment: productData.publishment
    })

    if (existingProduct) {
        throw new Error('Ya existe un producto con el mismo nombre en esta publicación')
    }

    const product = entityManager.create(Product, {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity,
        articleType: articleTypeEntity,
        kayakType: kayakTypeEntity,
        publishment: publishment
    })

    await entityManager.flush()
    return product
}

export async function updateProduct(id: number, productData: ProductUpdateData) {
    const product = await getProductById(id)
    const updateData: any = { ...productData }

    // Validar publicación si se proporciona
    if (productData.publishment !== undefined) {
        const publishment = await entityManager.findOne(Publishment, { id: productData.publishment })
        if (!publishment) {
            throw new Error(`La publicación con ID ${productData.publishment} no existe`)
        }
        updateData.publishment = publishment
    }

    // Validar articleType si se proporciona
    if (productData.articleType !== undefined) {
        if (productData.articleType === null) {
            updateData.articleType = null
        } else {
            const articleTypeEntity = await entityManager.findOne(ArticleType, { id: productData.articleType })
            if (!articleTypeEntity) {
                throw new Error(`El tipo de artículo con ID ${productData.articleType} no existe`)
            }
            updateData.articleType = articleTypeEntity
        }
    }

    // Validar kayakType si se proporciona
    if (productData.kayakType !== undefined) {
        if (productData.kayakType === null) {
            updateData.kayakType = null
        } else {
            const kayakTypeEntity = await entityManager.findOne(KayakType, { id: productData.kayakType })
            if (!kayakTypeEntity) {
                throw new Error(`El tipo de kayak con ID ${productData.kayakType} no existe`)
            }
            updateData.kayakType = kayakTypeEntity
        }
    }

    // Validar que al menos un tipo esté presente después de la actualización
    const finalArticleType = updateData.articleType !== undefined ? updateData.articleType : product.articleType
    const finalKayakType = updateData.kayakType !== undefined ? updateData.kayakType : product.kayakType

    if (finalArticleType === null && finalKayakType === null) {
        throw new Error('El producto debe tener al menos un tipo de artículo o un tipo de kayak')
    }

    // Validar unicidad del nombre si se está actualizando nombre o publicación
    if (updateData.name || updateData.publishment) {
        const finalName = updateData.name || product.name
        const finalPublishment = updateData.publishment || product.publishment

        const existingProduct = await entityManager.findOne(Product, {
            name: finalName,
            publishment: finalPublishment,
            $not: { id: product.id }
        })

        if (existingProduct) {
            throw new Error('Ya existe otro producto con el mismo nombre en esta publicación')
        }
    }

    entityManager.assign(product, updateData)
    await entityManager.flush()
    return product
}

export async function deleteProduct(id: number) {
    const product = await getProductById(id)
    await entityManager.removeAndFlush(product)
    return true
}

// Funciones adicionales
export async function getProductsByPublishment(publishmentId: number) {
    validateId(publishmentId, 'publicación')
    
    const publishment = await entityManager.findOne(Publishment, { id: publishmentId })
    if (!publishment) {
        throw new Error(`La publicación con ID ${publishmentId} no existe`)
    }

    return await entityManager.find(
        Product,
        { publishment: publishmentId },
        { 
            populate: ['articleType', 'kayakType'],
            orderBy: { name: 'ASC' }
        }
    )
}

export async function getProductsByArticleType(articleTypeId: number) {
    validateId(articleTypeId, 'tipo de artículo')
    
    const articleType = await entityManager.findOne(ArticleType, { id: articleTypeId })
    if (!articleType) {
        throw new Error(`El tipo de artículo con ID ${articleTypeId} no existe`)
    }

    return await entityManager.find(
        Product,
        { articleType: articleTypeId },
        { 
            populate: ['articleType', 'kayakType', 'publishment'],
            orderBy: { name: 'ASC' }
        }
    )
}

export async function getProductsByKayakType(kayakTypeId: number) {
    validateId(kayakTypeId, 'tipo de kayak')
    
    const kayakType = await entityManager.findOne(KayakType, { id: kayakTypeId })
    if (!kayakType) {
        throw new Error(`El tipo de kayak con ID ${kayakTypeId} no existe`)
    }

    return await entityManager.find(
        Product,
        { kayakType: kayakTypeId },
        { 
            populate: ['articleType', 'kayakType', 'publishment'],
            orderBy: { name: 'ASC' }
        }
    )
}