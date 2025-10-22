import { orm } from '../shared/dataBase/orm.js'
import { validateZipCode } from '../shared/utils/validationZipCode.js'
import { Localty } from './localty.entity.js'
import { Province } from '../province/province.entity.js'
import { User } from '../user/user.entity.js'
import { PickUpPoint } from '../pickUpPoint/pickUpPoint.entity.js'

const entityManager = orm.em

interface LocaltyCreateData {
	zipcode: string
	name: string
	province: number // ID de la provincia
}

interface LocaltyUpdateData {
	name?: string
	province?: number
}

export async function getAllLocalties() {
	return await entityManager.find(Localty, {}, { populate: ['province'] })
}

export async function getLocaltyByZipcode(zipcode: string) {
	validateZipCode(zipcode)

	const localty = await entityManager.findOne(Localty, { zipcode }, { populate: ['province'] })

	if (!localty) {
		throw new Error(`La localidad con código postal ${zipcode} no fue encontrada`)
	}
	return localty
}

export async function createLocalty(localtyData: LocaltyCreateData) {
	validateZipCode(localtyData.zipcode)

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
		province: province, // Pasamos la entidad, no solo el ID
	})

	await entityManager.flush()
	return localty
}

export async function updateLocalty(zipcode: string, localtyData: LocaltyUpdateData) {
	const localty = await getLocaltyByZipcode(zipcode)

	// Validar nombre único si se está actualizando
	if (localtyData.name && localtyData.name !== localty.name) {
		const existingName = await entityManager.findOne(Localty, { name: localtyData.name })
		if (existingName) {
			throw new Error(`La localidad '${localtyData.name}' ya existe`)
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

	if (localtyData.name) {
		localty.name = localtyData.name
	}

	entityManager.assign(localty, localtyData)
	await entityManager.flush()
	return localty
}

export async function deleteLocalty(zipcode: string) {
	const localty = await getLocaltyByZipcode(zipcode)

	// Verificar usuarios asociados
	const userCount = await entityManager.count(User, { localty })
	if (userCount > 0) {
		throw new Error(`Existen ${userCount} usuario${userCount > 1 ? 's' : ''} asociados a esta localidad`)
	}

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
