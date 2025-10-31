import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { SUPType } from './supType.entity.js'
import { Product } from '../product/product.entity.js'

const entityManager = orm.em

interface SUPTypeCreateData {
	model: string
	brand: string
	material: string
	paddlersQuantity: number
	maxWeightCapacity: number
	constructionType: string
	length: number
	width: number
	thickness: number
	boardType: string
	finConfiguration?: string
}

interface SUPTypeUpdateData extends Partial<SUPTypeCreateData> {}

export async function getAllSUPTypes() {
	return await entityManager.find(SUPType, {})
}

export async function getSUPTypeById(id: number) {
	validateId(id, 'tipo de SUP')
	const supType = await entityManager.findOne(SUPType, { id })
	if (!supType) {
		throw new Error(`El tipo de SUP con el ID ${id} no fue encontrado`)
	}
	return supType
}

export async function createSUPType(supTypeData: SUPTypeCreateData) {
	const existingSUPType = await entityManager.findOne(SUPType, {
		model: supTypeData.model,
		brand: supTypeData.brand,
	})
	if (existingSUPType) {
		throw new Error(`El tipo de SUP de modelo '${supTypeData.model}' y de marca '${supTypeData.brand}' ya existe`)
	}
	const supType = entityManager.create(SUPType, supTypeData)
	await entityManager.flush()
	return supType
}

export async function updateSUPType(id: number, supTypeData: SUPTypeUpdateData) {
	const supType = await getSUPTypeById(id)

	if (
		(supTypeData.model && supTypeData.model !== supType.model) ||
		(supTypeData.brand && supTypeData.brand !== supType.brand)
	) {
		const modelToCheck = supTypeData.model ?? supType.model
		const brandToCheck = supTypeData.brand ?? supType.brand
		const existingSUPType = await entityManager.findOne(SUPType, {
			model: modelToCheck,
			brand: brandToCheck,
		})
		if (existingSUPType) {
			throw new Error(`El tipo de SUP de modelo '${modelToCheck}' y de marca '${brandToCheck}' ya existe`)
		}
	}

	entityManager.assign(supType, supTypeData)
	await entityManager.flush()
	return supType
}

export async function deleteSUPType(id: number) {
	const supType = await getSUPTypeById(id)
	const productCount = await entityManager.count(Product, { supType: supType.id })
	if (productCount > 0) {
		throw new Error(
			`El tipo de SUP de modelo '${supType.model}' y de marca '${supType.brand}' categoriza ${productCount} producto${productCount > 1 ? 's' : ''}`
		)
	}
	await entityManager.removeAndFlush(supType)
	return true
}
