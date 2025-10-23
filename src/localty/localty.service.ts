import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { Localty } from './localty.entity.js'
import { Province } from '../province/province.entity.js'
import { PickUpPoint } from '../pickUpPoint/pickUpPoint.entity.js'

const entityManager = orm.em

interface LocaltyCreateData {
	zipcode: string
	name: string
	province: number
}

interface LocaltyUpdateData extends Partial<LocaltyCreateData> {}

export async function getAllLocalties() {
	return await entityManager.find(Localty, {}, { populate: ['province'] })
}

export async function getLocaltyById(id: number) {
	validateId(id, 'localidad')
	const localty = await entityManager.findOne(Localty, { id }, { populate: ['province'] })
	if (!localty) {
		throw new Error(`La localidad con el ID ${id} no fue encontrada`)
	}
	return localty
}

export async function createLocalty(localtyData: LocaltyCreateData) {
	// Validar código postal único
	const existingLocalty = await entityManager.findOne(Localty, { zipcode: localtyData.zipcode })
	if (existingLocalty) {
		throw new Error(`La localidad con código postal ${localtyData.zipcode} ya existe`)
	}

	// Validar nombre único
	const existingName = await entityManager.findOne(Localty, { name: localtyData.name })
	if (existingName) {
		throw new Error(`La localidad '${localtyData.name}' ya existe`)
	}

	// Obtener la entidad Province completa, no solo el ID
	const province = await entityManager.findOne(Province, { id: localtyData.province })
	if (!province) {
		throw new Error(`La provincia con ID ${localtyData.province} no existe`)
	}

	// Crear la localidad asignando la entidad Province completa
	const localty = entityManager.create(Localty, {
		zipcode: localtyData.zipcode,
		name: localtyData.name,
		province: province,
	})

	await entityManager.flush()
	return localty
}

export async function updateLocalty(id: number, localtyData: LocaltyUpdateData) {
	const localty = await getLocaltyById(id)

	// Validar código postal único si se está actualizando
	if (localtyData.zipcode && localtyData.zipcode !== localty.zipcode) {
		const existingZipCode = await entityManager.findOne(Localty, { zipcode: localtyData.zipcode })
		if (existingZipCode) {
			throw new Error(`La localidad con código postal '${localtyData.zipcode}' ya existe`)
		}
	}

	// Validar nombre único si se está actualizando
	if (localtyData.name && localtyData.name !== localty.name) {
		const existingName = await entityManager.findOne(Localty, { name: localtyData.name })
		if (existingName) {
			throw new Error(`La localidad'${localtyData.name}' ya existe`)
		}
	}

	// Si se actualiza la provincia, obtener la entidad completa
	if (localtyData.province) {
		const province = await entityManager.findOne(Province, { id: localtyData.province })
		if (!province) {
			throw new Error(`La provincia con ID ${localtyData.province} no existe`)
		}
		localty.province = province
	}

	if (localtyData.zipcode) {
		localty.zipcode = localtyData.zipcode
	}

	if (localtyData.name) {
		localty.name = localtyData.name
	}

	entityManager.assign(localty, localtyData)
	await entityManager.flush()
	return localty
}

export async function deleteLocalty(id: number) {
	const localty = await getLocaltyById(id)

	// Verificar puntos de recogida asociados
	const pickUpPointCount = await entityManager.count(PickUpPoint, { localty })
	if (pickUpPointCount > 0) {
		throw new Error(
			`Existen ${pickUpPointCount} punto${pickUpPointCount > 1 ? 's' : ''} de recogida asociados a esta localidad`
		)
	}

	await entityManager.removeAndFlush(localty)
	return true
}
