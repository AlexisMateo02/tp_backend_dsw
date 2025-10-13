import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { KayakType } from './kayakType.entity.js'
import { Product } from '../product/product.entity.js'

const entityManager = orm.em

interface KayakTypeCreateData {
	model: string
	brand: string
	material: string
	paddlersQuantity: number
	maxWeightCapacity: number
	constructionType: string
	length: number
	beam: number
}

interface KayakTypeUpdateData extends Partial<KayakTypeCreateData> {}

export async function getAllKayakTypes() {
	return await entityManager.find(KayakType, {})
}

export async function getKayakTypeById(id: number) {
	validateId(id, 'tipo de kayak')
	const kayakType = await entityManager.findOne(KayakType, { id })
	if (!kayakType) {
		throw new Error(`El tipo de kayak con el ID ${id} no fue encontrado`)
	}
	return kayakType
}

export async function createKayakType(kayakTypeData: KayakTypeCreateData) {
	const existingKayakType = await entityManager.findOne(KayakType, {
		model: kayakTypeData.model,
		brand: kayakTypeData.brand,
	})
	if (existingKayakType) {
		throw new Error(`El tipo de kayak de modelo '${kayakTypeData.model}' y de marca '${kayakTypeData.brand}' ya existe`)
	}
	const kayakType = entityManager.create(KayakType, kayakTypeData)
	await entityManager.flush()
	return kayakType
}

export async function updateKayakType(id: number, kayakTypeData: KayakTypeUpdateData) {
	const kayakType = await getKayakTypeById(id)
	if (
		(kayakTypeData.model && kayakTypeData.model !== kayakType.model) ||
		(kayakTypeData.brand && kayakTypeData.brand !== kayakType.brand)
	) {
		const modelToCheck = kayakTypeData.model ?? kayakType.model
		const brandToCheck = kayakTypeData.brand ?? kayakType.brand
		const existingKayakType = await entityManager.findOne(KayakType, {
			model: modelToCheck,
			brand: brandToCheck,
		})
		if (existingKayakType) {
			throw new Error(`El tipo de kayak de modelo '${modelToCheck}' y de marca '${brandToCheck}' ya existe`)
		}
	}
	entityManager.assign(kayakType, kayakTypeData)
	await entityManager.flush()
	return kayakType
}

export async function deleteKayakType(id: number) {
	const kayakType = await getKayakTypeById(id)
	const productCount = await entityManager.count(Product, { kayakType: kayakType.id })
	if (productCount > 0) {
		throw new Error(
			`El tipo de kayak de modelo '${kayakType.model}' y de marca '${
				kayakType.brand
			}' categoriza ${productCount} producto${productCount > 1 ? 's' : ''}`
		)
	}
	await entityManager.removeAndFlush(kayakType)
	return true
}
