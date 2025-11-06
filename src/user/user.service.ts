import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { User, UserRole } from './user.entity.js'
import { Order } from '../order/order.entity.js'
import * as bcrypt from 'bcrypt'

const entityManager = orm.em

interface UserCreateData {
	firstName: string
	lastName: string
	email: string
	password: string
	phone?: string
	role?: UserRole
}

interface UserUpdateData extends Partial<Omit<UserCreateData, 'password'>> {
	password?: string
}

export async function getAllUsers() {
	return await entityManager.find(User, {})
}

export async function getUserById(id: number) {
	validateId(id, 'usuario')
	const user = await entityManager.findOne(User, { id })
	if (!user) {
		throw new Error(`El usuario con el ID ${id} no fue encontrado`)
	}
	return user
}

export async function getUserByEmail(email: string) {
	const user = await entityManager.findOne(User, { email })
	if (!user) {
		throw new Error(`El usuario con el email ${email} no fue encontrado`)
	}
	return user
}

export async function createUser(userData: UserCreateData) {
	const existingUser = await entityManager.findOne(User, { email: userData.email })
	if (existingUser) {
		throw new Error(`El email '${userData.email}' ya está registrado`)
	}

	const hashedPassword = await bcrypt.hash(userData.password, 10)

	const user = entityManager.create(User, {
		...userData,
		password: hashedPassword,
		role: userData.role || UserRole.CUSTOMER,
	})

	await entityManager.flush()
	return user
}

export async function updateUser(id: number, userData: UserUpdateData) {
	const user = await getUserById(id)

	if (userData.email && userData.email !== user.email) {
		const existingUser = await entityManager.findOne(User, { email: userData.email })
		if (existingUser) {
			throw new Error(`El email '${userData.email}' ya está registrado`)
		}
	}

	// Si se está actualizando la contraseña, hashearla
	if (userData.password) {
		userData.password = await bcrypt.hash(userData.password, 10)
	}

	entityManager.assign(user, userData)
	await entityManager.flush()
	return user
}

export async function deleteUser(id: number) {
	const user = await getUserById(id)

	// Verificar órdenes asociadas
	const orderCount = await entityManager.count(Order, { user: user.id })
	if (orderCount > 0) {
		throw new Error(
			`El usuario tiene ${orderCount} orden${orderCount > 1 ? 'es' : ''} asociada${orderCount > 1 ? 's' : ''}`
		)
	}

	await entityManager.removeAndFlush(user)
	return true
}

export async function changeThePassword(id: number, currentPassword: string, newPassword: string) {
	const user = await getUserById(id)

	// Verificar contraseña actual
	const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
	if (!isCurrentPasswordValid) {
		throw new Error('La contraseña actual es incorrecta')
	}

	// Hashear nueva contraseña
	const hashedPassword = await bcrypt.hash(newPassword, 10)
	user.password = hashedPassword

	await entityManager.flush()
	return user
}
