import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { BoatType } from './boatType.entity.js'
import { Product } from '../product/product.entity.js'

const entityManager = orm.em

interface BoatTypeCreateData {
	model: string
	brand: string
	boatCategory: string
	material: string
	passengerCapacity: number
	maxWeightCapacity: number
	length: number
	beam: number
	hullType: string
	motorType?: string
	maxHorsePower?: number
}

interface BoatTypeUpdateData extends Partial<BoatTypeCreateData> {}

export async function getAllBoatTypes() {
	return await entityManager.find(BoatType, {})
}

export async function getBoatTypeById(id: number) {
	validateId(id, 'tipo de embarcación')
	const boatType = await entityManager.findOne(BoatType, { id })
	if (!boatType) {
		throw new Error(`El tipo de embarcación con el ID ${id} no fue encontrado`)
	}
	return boatType
}

export async function createBoatType(boatTypeData: BoatTypeCreateData) {
	const existingBoatType = await entityManager.findOne(BoatType, {
		model: boatTypeData.model,
		brand: boatTypeData.brand,
	})
	if (existingBoatType) {
		throw new Error(
			`El tipo de embarcación de modelo '${boatTypeData.model}' y de marca '${boatTypeData.brand}' ya existe`
		)
	}
	const boatType = entityManager.create(BoatType, boatTypeData)
	await entityManager.flush()
	return boatType
}

export async function updateBoatType(id: number, boatTypeData: BoatTypeUpdateData) {
	const boatType = await getBoatTypeById(id)

	if (
		(boatTypeData.model && boatTypeData.model !== boatType.model) ||
		(boatTypeData.brand && boatTypeData.brand !== boatType.brand)
	) {
		const modelToCheck = boatTypeData.model ?? boatType.model
		const brandToCheck = boatTypeData.brand ?? boatType.brand
		const existingBoatType = await entityManager.findOne(BoatType, {
			model: modelToCheck,
			brand: brandToCheck,
		})
		if (existingBoatType) {
			throw new Error(`El tipo de embarcación de modelo '${modelToCheck}' y de marca '${brandToCheck}' ya existe`)
		}
	}

	entityManager.assign(boatType, boatTypeData)
	await entityManager.flush()
	return boatType
}

export async function deleteBoatType(id: number) {
	const boatType = await getBoatTypeById(id)
	const productCount = await entityManager.count(Product, { boatType: boatType.id })
	if (productCount > 0) {
		throw new Error(
			`El tipo de embarcación de modelo '${boatType.model}' y de marca '${boatType.brand}' categoriza ${productCount} producto${productCount > 1 ? 's' : ''}`
		)
	}
	await entityManager.removeAndFlush(boatType)
	return true
}
