import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { ArticleType } from './articleType.entity.js'
import { Product } from '../product/product.entity.js'

const entityManager = orm.em

interface ArticleTypeCreateData {
	name: string
	mainUse: string
}

interface ArticleTypeUpdateData extends Partial<ArticleTypeCreateData> {}

export async function getAllArticleTypes() {
	return await entityManager.find(ArticleType, {})
}

export async function getArticleTypeById(id: number) {
	validateId(id, 'tipo de artículo')
	const articleType = await entityManager.findOne(ArticleType, { id })
	if (!articleType) {
		throw new Error(`El tipo de artículo con el ID ${id} no fue encontrado`)
	}
	return articleType
}

export async function createArticleType(articleTypeData: ArticleTypeCreateData) {
	const existingArticleType = await entityManager.findOne(ArticleType, { name: articleTypeData.name })
	if (existingArticleType) {
		throw new Error(`El tipo de artículo '${articleTypeData.name}' ya existe`)
	}
	const articleType = entityManager.create(ArticleType, articleTypeData)
	await entityManager.flush()
	return articleType
}

export async function updateArticleType(id: number, articleTypeData: ArticleTypeUpdateData) {
	const articleType = await getArticleTypeById(id)
	if (articleTypeData.name && articleTypeData.name !== articleType.name) {
		const existingArticleType = await entityManager.findOne(ArticleType, {
			name: articleTypeData.name,
		})
		if (existingArticleType) {
			throw new Error(`El tipo de artículo '${articleTypeData.name}' ya existe`)
		}
	}
	entityManager.assign(articleType, articleTypeData)
	await entityManager.flush()
	return articleType
}

export async function deleteArticleType(id: number) {
	const articleType = await getArticleTypeById(id)
	const productCount = await entityManager.count(Product, { articleType: articleType.id })
	if (productCount > 0) {
		throw new Error(
			`El tipo de artículo '${articleType.name}' categoriza ${productCount} producto${productCount > 1 ? 's' : ''}`
		)
	}
	await entityManager.removeAndFlush(articleType)
	return true
}
