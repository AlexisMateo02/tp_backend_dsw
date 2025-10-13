import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { Province } from './province.entity.js'
import { Localty } from '../localty/localty.entity.js'

const entityManager = orm.em

interface ProvinceCreateData {
	name: string
	country: string
}

interface ProvinceUpdateData extends Partial<ProvinceCreateData> {}

export async function getAllProvinces() {
	return await entityManager.find(Province, {})
}

export async function getProvinceById(id: number) {
	validateId(id, 'provincia')
	const province = await entityManager.findOne(Province, { id })
	if (!province) {
		throw new Error(`La provincia con el ID ${id} no fue encontrada`)
	}
	return province
}

export async function createProvince(provinceData: ProvinceCreateData) {
	const existingProvince = await entityManager.findOne(Province, { name: provinceData.name })
	if (existingProvince) {
		throw new Error(`La provincia '${provinceData.name}' ya existe`)
	}
	const province = entityManager.create(Province, provinceData)
	await entityManager.flush()
	return province
}

export async function updateProvince(id: number, provinceData: ProvinceUpdateData) {
	const province = await getProvinceById(id)
	if (provinceData.name && provinceData.name !== province.name) {
		const existingProvince = await entityManager.findOne(Province, {
			name: provinceData.name,
		})
		if (existingProvince) {
			throw new Error(`La provincia '${provinceData.name}' ya existe`)
		}
	}
	entityManager.assign(province, provinceData)
	await entityManager.flush()
	return province
}

export async function deleteProvince(id: number) {
	const province = await getProvinceById(id)
	const localtyCount = await entityManager.count(Localty, { province: province.id })
	if (localtyCount > 0) {
		throw new Error(`En '${province.name}' se ubican ${localtyCount} localidad${localtyCount > 1 ? 'es' : ''}`)
	}
	await entityManager.removeAndFlush(province)
	return true
}
