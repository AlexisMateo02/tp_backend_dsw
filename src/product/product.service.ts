import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { Product, ProductCategory } from './product.entity.js'
import { User, UserRole } from '../user/user.entity.js'
import { KayakType } from '../kayakType/kayakType.entity.js'
import { SUPType } from '../supType/supType.entity.js'
import { BoatType } from '../boatType/boatType.entity.js'
import { ArticleType } from '../articleType/articleType.entity.js'
import { OrderItem } from '../orderItem/orderItem.entity.js'

const entityManager = orm.em

interface ProductCreateData {
	Productname: string
	price: string
	oldPrice?: string
	tag?: string
	category: ProductCategory
	stock?: number
	image: string
	secondImage?: string
	thirdImage?: string
	fourthImage?: string
	description?: string
	includes?: string
	kayakTypeId?: number
	supTypeId?: number
	boatTypeId?: number
	articleTypeId?: number
	sellerId?: number
}

interface ProductUpdateData extends Partial<ProductCreateData> {}

export async function getAllProducts() {
	return await entityManager.find(
		Product,
		{},
		{
			populate: ['kayakType', 'supType', 'boatType', 'articleType', 'seller'],
		}
	)
}

export async function getApprovedProducts() {
	return await entityManager.find(
		Product,
		{ approved: true },
		{
			populate: ['kayakType', 'supType', 'boatType', 'articleType', 'seller'],
		}
	)
}

export async function getPendingProducts() {
	return await entityManager.find(
		Product,
		{ approved: false },
		{
			populate: ['kayakType', 'supType', 'boatType', 'articleType', 'seller'],
		}
	)
}

export async function getProductsByCategory(category: ProductCategory) {
	return await entityManager.find(
		Product,
		{ category, approved: true },
		{
			populate: ['kayakType', 'supType', 'boatType', 'articleType', 'seller'],
		}
	)
}

export async function getProductsBySeller(sellerId: number) {
	validateId(sellerId, 'vendedor')
	return await entityManager.find(
		Product,
		{ seller: sellerId },
		{
			populate: ['kayakType', 'supType', 'boatType', 'articleType', 'seller'],
		}
	)
}

export async function getProductById(id: number) {
	validateId(id, 'producto')
	const product = await entityManager.findOne(
		Product,
		{ id },
		{
			populate: ['kayakType', 'supType', 'boatType', 'articleType', 'seller', 'reviews'],
		}
	)
	if (!product) {
		throw new Error(`El producto con el ID ${id} no fue encontrado`)
	}
	return product
}

export async function createProduct(productData: ProductCreateData) {
	// Validar tipo específico según categoría
	if (productData.category === ProductCategory.KAYAK && !productData.kayakTypeId) {
		throw new Error('Se requiere un tipo de kayak para esta categoría')
	}
	if (productData.category === ProductCategory.SUP && !productData.supTypeId) {
		throw new Error('Se requiere un tipo de SUP para esta categoría')
	}
	if (productData.category === ProductCategory.EMBARCACION && !productData.boatTypeId) {
		throw new Error('Se requiere un tipo de embarcación para esta categoría')
	}
	if (productData.category === ProductCategory.ARTICULO && !productData.articleTypeId) {
		throw new Error('Se requiere un tipo de artículo para esta categoría')
	}

	// Obtener relaciones
	let kayakType, supType, boatType, articleType, seller

	if (productData.kayakTypeId) {
		kayakType = await entityManager.findOne(KayakType, { id: productData.kayakTypeId })
		if (!kayakType) {
			throw new Error(`El tipo de kayak con ID ${productData.kayakTypeId} no existe`)
		}
	}

	if (productData.supTypeId) {
		supType = await entityManager.findOne(SUPType, { id: productData.supTypeId })
		if (!supType) {
			throw new Error(`El tipo de SUP con ID ${productData.supTypeId} no existe`)
		}
	}

	if (productData.boatTypeId) {
		boatType = await entityManager.findOne(BoatType, { id: productData.boatTypeId })
		if (!boatType) {
			throw new Error(`El tipo de embarcación con ID ${productData.boatTypeId} no existe`)
		}
	}

	if (productData.articleTypeId) {
		articleType = await entityManager.findOne(ArticleType, { id: productData.articleTypeId })
		if (!articleType) {
			throw new Error(`El tipo de artículo con ID ${productData.articleTypeId} no existe`)
		}
	}

	if (productData.sellerId) {
		seller = await entityManager.findOne(User, { id: productData.sellerId })
		if (!seller || seller.role !== UserRole.SELLER) {
			throw new Error('El vendedor especificado no es válido')
		}
	}

	const product = entityManager.create(Product, {
		Productname: productData.Productname,
		price: productData.price,
		oldPrice: productData.oldPrice,
		tag: productData.tag,
		category: productData.category,
		stock: productData.stock || 1,
		image: productData.image,
		secondImage: productData.secondImage,
		thirdImage: productData.thirdImage,
		fourthImage: productData.fourthImage,
		description: productData.description,
		includes: productData.includes,
		kayakType,
		supType,
		boatType,
		articleType,
		seller,
		sellerName: seller?.businessName,
		approved: seller ? false : true, //! Productos KBR se aprueban automáticamente
		soldCount: 0,
		createdAt: new Date(),
	})

	await entityManager.flush()
	return product
}

export async function updateProduct(id: number, productData: ProductUpdateData) {
	const product = await getProductById(id)

	// Si se cambia la categoría, validar tipo correspondiente
	if (productData.category && productData.category !== product.category) {
		if (productData.category === ProductCategory.KAYAK && !productData.kayakTypeId) {
			throw new Error('Se requiere un tipo de kayak para esta categoría')
		}
		if (productData.category === ProductCategory.SUP && !productData.supTypeId) {
			throw new Error('Se requiere un tipo de SUP para esta categoría')
		}
		if (productData.category === ProductCategory.EMBARCACION && !productData.boatTypeId) {
			throw new Error('Se requiere un tipo de embarcación para esta categoría')
		}
		if (productData.category === ProductCategory.ARTICULO && !productData.articleTypeId) {
			throw new Error('Se requiere un tipo de artículo para esta categoría')
		}
	}

	// Actualizar relaciones si se especifican
	if (productData.kayakTypeId) {
		const kayakType = await entityManager.findOne(KayakType, { id: productData.kayakTypeId })
		if (!kayakType) {
			throw new Error(`El tipo de kayak con ID ${productData.kayakTypeId} no existe`)
		}
		product.kayakType = kayakType
	}

	if (productData.supTypeId) {
		const supType = await entityManager.findOne(SUPType, { id: productData.supTypeId })
		if (!supType) {
			throw new Error(`El tipo de SUP con ID ${productData.supTypeId} no existe`)
		}
		product.supType = supType
	}

	if (productData.boatTypeId) {
		const boatType = await entityManager.findOne(BoatType, { id: productData.boatTypeId })
		if (!boatType) {
			throw new Error(`El tipo de embarcación con ID ${productData.boatTypeId} no existe`)
		}
		product.boatType = boatType
	}

	if (productData.articleTypeId) {
		const articleType = await entityManager.findOne(ArticleType, { id: productData.articleTypeId })
		if (!articleType) {
			throw new Error(`El tipo de artículo con ID ${productData.articleTypeId} no existe`)
		}
		product.articleType = articleType
	}

	entityManager.assign(product, productData)
	await entityManager.flush()
	return product
}

export async function approveProduct(id: number) {
	const product = await getProductById(id)
	product.approved = true
	await entityManager.flush()
	return product
}

export async function deleteProduct(id: number) {
	const product = await getProductById(id)

	const orderItemCount = await entityManager.count(OrderItem, { product: product.id })
	if (orderItemCount > 0) {
		throw new Error(`El producto está incluido en ${orderItemCount} orden${orderItemCount > 1 ? 'es' : ''}`)
	}

	await entityManager.removeAndFlush(product)
	return true
}
