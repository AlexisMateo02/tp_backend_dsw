import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { PickUpPoint } from './pickUpPoint.entity.js'
import { Localty } from '../localty/localty.entity.js'
import { Order } from '../order/order.entity.js'

const entityManager = orm.em

interface PickUpPointCreateData {
	storeName?: string
	address: string
	adressDescription?: string
	phoneNumber?: string
	horary?: string
	localty: number  // CAMBIAR: de localtyId a localty
}

interface PickUpPointUpdateData extends Partial<PickUpPointCreateData> {}

export async function getAllPickUpPoints() {
	return await entityManager.find(PickUpPoint, {}, { populate: ['localty', 'localty.province'] })
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
	console.log('🔍 DEBUG - Service createPickUpPoint recibió:', pickUpPointData)
	
	// Obtener localidad - usar pickUpPointData.localty en lugar de pickUpPointData.localtyId
	const localty = await entityManager.findOne(Localty, { id: pickUpPointData.localty })
	if (!localty) {
		throw new Error(`La localidad con ID ${pickUpPointData.localty} no existe`)
	}

	const pickUpPoint = entityManager.create(PickUpPoint, {
		storeName: pickUpPointData.storeName,
		address: pickUpPointData.address,
		adressDescription: pickUpPointData.adressDescription,
		phoneNumber: pickUpPointData.phoneNumber,
		horary: pickUpPointData.horary,
		localty,
	})

	await entityManager.flush()
	return pickUpPoint
}

export async function updatePickUpPoint(id: number, pickUpPointData: PickUpPointUpdateData) {
	const pickUpPoint = await getPickUpPointById(id)

	// Si se actualiza la localidad - usar pickUpPointData.localty en lugar de pickUpPointData.localtyId
	if (pickUpPointData.localty) {
		const localty = await entityManager.findOne(Localty, { id: pickUpPointData.localty })
		if (!localty) {
			throw new Error(`La localidad con ID ${pickUpPointData.localty} no existe`)
		}
		pickUpPoint.localty = localty
	}

	entityManager.assign(pickUpPoint, pickUpPointData)
	await entityManager.flush()
	return pickUpPoint
}

export async function deletePickUpPoint(id: number) {
	const pickUpPoint = await getPickUpPointById(id)

	// Verificar si hay órdenes asociadas a este punto de retiro
	const orderCount = await entityManager.count(Order, { pickUpPoint: pickUpPoint.id })
	if (orderCount > 0) {
		throw new Error(
			`No se puede eliminar el punto de retiro porque tiene ${orderCount} orden${orderCount > 1 ? 'es' : ''} asociada${orderCount > 1 ? 's' : ''}`
		)
	}

	await entityManager.removeAndFlush(pickUpPoint)
	return true
}
