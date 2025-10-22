import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { validateZipCode } from '../shared/utils/validationZipCode.js'
import { PickUpPoint } from './pickUpPoint.entity.js'
import { Localty } from '../localty/localty.entity.js'
import { Publishment } from '../publishment/publishment.entity.js'

const entityManager = orm.em

interface PickUpPointCreateData {
	adressStreet: string
	adressnumber: number
	adressFloor?: number
	adressApartment?: string
	tower?: number
	localty: string // zipcode de la localidad
}

interface PickUpPointUpdateData extends Partial<PickUpPointCreateData> {}

export async function getAllPickUpPoints() {
	return await entityManager.find(
		PickUpPoint,
		{},
		{
			populate: ['localty'],
			orderBy: { id: 'ASC' },
		}
	)
}

export async function getPickUpPointById(id: number) {
	validateId(id, 'punto de recogida')

	const pickUpPoint = await entityManager.findOne(
		PickUpPoint,
		{ id },
		{
			populate: ['localty', 'localty.province'],
		}
	)

	if (!pickUpPoint) {
		throw new Error(`El punto de recogida con el ID ${id} no fue encontrado`)
	}
	return pickUpPoint
}

export async function createPickUpPoint(pickUpPointData: PickUpPointCreateData) {
	// Validar que la localidad existe
	const localty = await entityManager.findOne(Localty, { zipcode: pickUpPointData.localty }, { populate: ['province'] })

	if (!localty) {
		throw new Error(`La localidad con código postal ${pickUpPointData.localty} no existe`)
	}

	// Validar que no existe un punto de recogida con la misma dirección
	const existingPickUpPoint = await entityManager.findOne(PickUpPoint, {
		adressStreet: pickUpPointData.adressStreet,
		adressnumber: pickUpPointData.adressnumber,
		adressFloor: pickUpPointData.adressFloor,
		adressApartment: pickUpPointData.adressApartment,
		localty: localty,
	})

	if (existingPickUpPoint) {
		throw new Error('Ya existe un punto de recogida con la misma dirección en esta localidad')
	}

	const pickUpPoint = entityManager.create(PickUpPoint, {
		adressStreet: pickUpPointData.adressStreet,
		adressnumber: pickUpPointData.adressnumber,
		adressFloor: pickUpPointData.adressFloor,
		adressApartment: pickUpPointData.adressApartment,
		tower: pickUpPointData.tower,
		localty: localty,
	})

	await entityManager.flush()
	return pickUpPoint
}

export async function updatePickUpPoint(id: number, pickUpPointData: PickUpPointUpdateData) {
	const pickUpPoint = await getPickUpPointById(id)
	const updateData: any = { ...pickUpPointData }

	// Si se está actualizando la localidad, obtener la entidad completa
	if (pickUpPointData.localty) {
		const localty = await entityManager.findOne(
			Localty,
			{ zipcode: pickUpPointData.localty },
			{ populate: ['province'] }
		)

		if (!localty) {
			throw new Error(`La localidad con código postal ${pickUpPointData.localty} no existe`)
		}
		updateData.localty = localty
	}

	// Validar unicidad si se están actualizando campos de dirección
	if (updateData.adressStreet || updateData.adressnumber || updateData.localty) {
		const finalStreet = updateData.adressStreet || pickUpPoint.adressStreet
		const finalNumber = updateData.adressnumber || pickUpPoint.adressnumber
		const finalFloor = updateData.adressFloor !== undefined ? updateData.adressFloor : pickUpPoint.adressFloor
		const finalApartment =
			updateData.adressApartment !== undefined ? updateData.adressApartment : pickUpPoint.adressApartment
		const finalLocalty = updateData.localty || pickUpPoint.localty

		const existingPickUpPoint = await entityManager.findOne(PickUpPoint, {
			adressStreet: finalStreet,
			adressnumber: finalNumber,
			adressFloor: finalFloor,
			adressApartment: finalApartment,
			localty: finalLocalty,
			$not: { id: pickUpPoint.id }, // Excluir el actual
		})

		if (existingPickUpPoint) {
			throw new Error('Ya existe otro punto de recogida con la misma dirección en esta localidad')
		}
	}

	entityManager.assign(pickUpPoint, updateData)
	await entityManager.flush()
	return pickUpPoint
}

export async function deletePickUpPoint(id: number) {
	const pickUpPoint = await getPickUpPointById(id)

	// Verificar publicaciones asociadas
	const publishmentCount = await entityManager.count(Publishment, {
		pickUpPoint: pickUpPoint,
	})

	if (publishmentCount > 0) {
		throw new Error(
			`No se puede eliminar el punto de recogida. Existen ${publishmentCount} publicación${publishmentCount > 1 ? 'es' : ''} asociadas`
		)
	}

	await entityManager.removeAndFlush(pickUpPoint)
	return true
}

// Función adicional para buscar puntos de recogida por localidad
export async function getPickUpPointsByLocalty(zipcode: string) {
	validateZipCode(zipcode)
	const localty = await entityManager.findOne(Localty, { zipcode })

	if (!localty) {
		throw new Error(`La localidad con código postal ${zipcode} no existe`)
	}

	return await entityManager.find(
		PickUpPoint,
		{ localty },
		{
			populate: ['localty'],
			orderBy: { adressStreet: 'ASC' },
		}
	)
}

// Función adicional para buscar puntos de recogida por provincia
export async function getPickUpPointsByProvince(provinceId: number) {
	validateId(provinceId, 'provincia')

	return await entityManager.find(
		PickUpPoint,
		{ localty: { province: provinceId } },
		{
			populate: ['localty', 'localty.province'],
			orderBy: { localty: { name: 'ASC' } },
		}
	)
}
