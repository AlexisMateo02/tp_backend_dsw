import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { PickUpPoint } from './pickUpPoint.entity.js'
import { Localty } from '../localty/localty.entity.js'

const entityManager = orm.em

interface PickUpPointCreateData {
	name: string
	address: string
	phone?: string
	email?: string
	description?: string
	openingHours?: string
	imageUrl?: string
	latitude?: number
	longitude?: number
	localtyId: number
}

interface PickUpPointUpdateData extends Partial<PickUpPointCreateData> {
	active?: boolean
}

export async function getAllPickUpPoints() {
	return await entityManager.find(PickUpPoint, {}, { populate: ['localty', 'localty.province'] })
}

export async function getActivePickUpPoints() {
	return await entityManager.find(PickUpPoint, { active: true }, { populate: ['localty', 'localty.province'] })
}

export async function getPickUpPointById(id: number) {
	validateId(id, 'punto de retiro')
	const pickUpPoint = await entityManager.findOne(PickUpPoint, { id }, { populate: ['localty', 'localty.province'] })
	if (!pickUpPoint) {
		throw new Error(`El punto de retiro con el ID ${id} no fue encontrado`)
	}
	return pickUpPoint
}

export async function getPickUpPointsByLocalty(localtyId: number) {
	validateId(localtyId, 'localidad')
	return await entityManager.find(PickUpPoint, { localty: localtyId }, { populate: ['localty'] })
}

export async function createPickUpPoint(pickUpPointData: PickUpPointCreateData) {
	// Obtener localidad
	const localty = await entityManager.findOne(Localty, { id: pickUpPointData.localtyId })
	if (!localty) {
		throw new Error(`La localidad con ID ${pickUpPointData.localtyId} no existe`)
	}

	const pickUpPoint = entityManager.create(PickUpPoint, {
		name: pickUpPointData.name,
		address: pickUpPointData.address,
		phone: pickUpPointData.phone,
		email: pickUpPointData.email,
		description: pickUpPointData.description,
		openingHours: pickUpPointData.openingHours,
		imageUrl: pickUpPointData.imageUrl,
		latitude: pickUpPointData.latitude,
		longitude: pickUpPointData.longitude,
		localty,
		active: true,
	})

	await entityManager.flush()
	return pickUpPoint
}

export async function updatePickUpPoint(id: number, pickUpPointData: PickUpPointUpdateData) {
	const pickUpPoint = await getPickUpPointById(id)

	// Si se actualiza la localidad
	if (pickUpPointData.localtyId) {
		const localty = await entityManager.findOne(Localty, { id: pickUpPointData.localtyId })
		if (!localty) {
			throw new Error(`La localidad con ID ${pickUpPointData.localtyId} no existe`)
		}
		pickUpPoint.localty = localty
	}

	entityManager.assign(pickUpPoint, pickUpPointData)
	await entityManager.flush()
	return pickUpPoint
}

export async function deletePickUpPoint(id: number) {
	const pickUpPoint = await getPickUpPointById(id)
	await entityManager.removeAndFlush(pickUpPoint)
	return true
}
