import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import bcrypt from 'bcrypt'
import { User } from './user.entity.js'
import { Localty } from '../localty/localty.entity.js'
import { Purchase } from '../purchase/purchase.entity.js'
import { Publishment } from '../publishment/publishment.entity.js'
import { Rating } from '../rating/rating.entity.js'

const entityManager = orm.em
const SALT_ROUNDS = 12

interface UserCreateData {
	firstName: string
	lastName: string
	email: string
	password: string
	localty: string // zipcode de la localidad
	sellsQuantity?: number
	sellerType?: string
}

interface UserUpdateData extends Partial<Omit<UserCreateData, 'password'>> {
	password?: string
}

interface UserResponse {
	id: number
	firstName: string
	lastName: string
	email: string
	sellsQuantity?: number
	sellerType?: string
	localty: any
}

// Función para hashear password
async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS)
}

// Función para eliminar datos sensibles de la respuesta
function sanitizeUserResponse(user: User): UserResponse {
	const response: UserResponse = {
		id: user.id!,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		localty: user.localty,
	}

	if (user.sellsQuantity !== undefined) response.sellsQuantity = user.sellsQuantity
	if (user.sellerType !== undefined) response.sellerType = user.sellerType

	return response
}

// Función para determinar sellerType basado en sellsQuantity
function determineSellerType(sellsQuantity: number): string {
	if (sellsQuantity === 0) return 'Nuevo'
	if (sellsQuantity <= 10) return 'Principiante'
	if (sellsQuantity <= 50) return 'Intermedio'
	if (sellsQuantity <= 100) return 'Experto'
	return 'Profesional'
}

export async function getAllUsers() {
	const users = await entityManager.find(
		User,
		{},
		{
			populate: ['localty'],
			orderBy: { lastName: 'ASC', firstName: 'ASC' },
		}
	)
	return users.map(sanitizeUserResponse)
}

export async function getUserById(id: number) {
	validateId(id, 'usuario')
	const user = await entityManager.findOne(
		User,
		{ id },
		{
			populate: ['localty'],
		}
	)
	if (!user) {
		throw new Error(`El usuario con el ID ${id} no fue encontrado`)
	}
	return sanitizeUserResponse(user)
}

export async function getUserWithSensitiveData(id: number): Promise<User> {
	validateId(id, 'usuario')
	const user = await entityManager.findOne(
		User,
		{ id },
		{
			populate: ['localty', 'purchases', 'publishments', 'ratingsGiven', 'ratingsReceived'],
		}
	)
	if (!user) {
		throw new Error(`El usuario con el ID ${id} no fue encontrado`)
	}
	return user
}

export async function createUser(userData: UserCreateData) {
	// Validar que la localidad existe
	const localty = await entityManager.findOne(Localty, { zipcode: userData.localty })
	if (!localty) {
		throw new Error(`La localidad con código postal ${userData.localty} no existe`)
	}
	// Validar que el email no existe
	const existingUser = await entityManager.findOne(User, { email: userData.email.toLowerCase() })
	if (existingUser) {
		throw new Error('Ya existe un usuario con este email')
	}
	// Hashear password
	const hashedPassword = await hashPassword(userData.password)

	// Determinar sellerType si no se proporciona
	const sellsQuantity = userData.sellsQuantity || 0
	const sellerType = userData.sellerType || determineSellerType(sellsQuantity)

	// Crear el usuario
	const user = new User()
	user.firstName = userData.firstName
	user.lastName = userData.lastName
	user.email = userData.email.toLowerCase()
	user.password = hashedPassword
	user.localty = localty
	user.sellsQuantity = sellsQuantity
	user.sellerType = sellerType

	await entityManager.persistAndFlush(user)
	return sanitizeUserResponse(user)
}

export async function updateUser(id: number, userData: UserUpdateData) {
	const user = await getUserWithSensitiveData(id)

	// Validar localidad si se proporciona
	if (userData.localty) {
		const localty = await entityManager.findOne(Localty, { zipcode: userData.localty })
		if (!localty) {
			throw new Error(`La localidad con código postal ${userData.localty} no existe`)
		}
		user.localty = localty
	}

	// Validar email si se proporciona
	if (userData.email && userData.email !== user.email) {
		const existingUser = await entityManager.findOne(User, { email: userData.email.toLowerCase() })
		if (existingUser) {
			throw new Error('Ya existe otro usuario con este email')
		}
		user.email = userData.email.toLowerCase()
	}

	// Hashear password si se proporciona
	if (userData.password) {
		user.password = await hashPassword(userData.password)
	}

	// Actualizar sellerType si cambia sellsQuantity
	if (userData.sellsQuantity !== undefined) {
		user.sellsQuantity = userData.sellsQuantity
		user.sellerType = determineSellerType(userData.sellsQuantity)
	}

	// Actualizar otros campos
	if (userData.firstName !== undefined) user.firstName = userData.firstName
	if (userData.lastName !== undefined) user.lastName = userData.lastName
	if (userData.sellerType !== undefined) user.sellerType = userData.sellerType

	await entityManager.flush()
	return sanitizeUserResponse(user)
}

export async function deleteUser(id: number) {
	const user = await getUserWithSensitiveData(id)

	// Verificar publicaciones activas
	const activePublishments = await entityManager.count(Publishment, {
		user: user,
	})

	if (activePublishments > 0) {
		throw new Error('No se puede eliminar el usuario porque tiene publicaciones activas')
	}

	// Verificar compras pendientes
	const pendingPurchases = await entityManager.count(Purchase, {
		user: user,
	})

	if (pendingPurchases > 0) {
		throw new Error('No se puede eliminar el usuario porque tiene compras pendientes')
	}

	await entityManager.removeAndFlush(user)
	return true
}

// Funciones adicionales específicas para User
export async function getUserByEmail(email: string) {
	const user = await entityManager.findOne(User, { email: email.toLowerCase() }, { populate: ['localty'] })

	if (!user) {
		throw new Error(`El usuario con email ${email} no fue encontrado`)
	}
	return sanitizeUserResponse(user)
}

export async function updateUserPassword(id: number, newPassword: string) {
	const user = await getUserWithSensitiveData(id)
	user.password = await hashPassword(newPassword)
	await entityManager.flush()
	return true
}

export async function verifyUserPassword(id: number, password: string): Promise<boolean> {
	const user = await getUserWithSensitiveData(id)
	return await bcrypt.compare(password, user.password)
}

export async function getUserStats(id: number) {
	const user = await getUserWithSensitiveData(id)

	// Calcular estadísticas
	const totalPurchases = await entityManager.count(Purchase, { user: user })
	const totalPublishments = await entityManager.count(Publishment, { user: user })

	// Obtener ratings recibidos (como vendedor) y ratings dados (como cliente)
	const ratingsReceived = await entityManager.find(Rating, { seller: user })
	const ratingsGiven = await entityManager.find(Rating, { customer: user })

	// Calcular promedio de ratings recibidos usando 'score'
	const averageRating =
		ratingsReceived.length > 0
			? ratingsReceived.reduce((sum, rating) => sum + rating.score, 0) / ratingsReceived.length
			: 0

	return {
		user: sanitizeUserResponse(user),
		stats: {
			totalPurchases,
			totalPublishments,
			averageRating: Number(averageRating.toFixed(2)),
			ratingsReceived: ratingsReceived.length,
			ratingsGiven: ratingsGiven.length,
			sellsQuantity: user.sellsQuantity || 0,
			sellerType: user.sellerType || 'Nuevo',
		},
	}
}

export async function getUsersByLocalty(zipcode: string) {
	const localty = await entityManager.findOne(Localty, { zipcode })
	if (!localty) {
		throw new Error(`La localidad con código postal ${zipcode} no existe`)
	}

	const users = await entityManager.find(
		User,
		{ localty },
		{
			populate: ['localty'],
			orderBy: { lastName: 'ASC' },
		}
	)

	return users.map(sanitizeUserResponse)
}

// Función para incrementar sellsQuantity automáticamente
export async function incrementUserSells(userId: number) {
	const user = await getUserWithSensitiveData(userId)
	const newSellsQuantity = (user.sellsQuantity || 0) + 1
	const newSellerType = determineSellerType(newSellsQuantity)

	user.sellsQuantity = newSellsQuantity
	user.sellerType = newSellerType

	await entityManager.flush()
	return sanitizeUserResponse(user)
}

// Funciones específicas para ratings
export async function getUserRatingsReceived(userId: number) {
	const user = await getUserById(userId)
	const ratings = await entityManager.find(
		Rating,
		{ seller: { id: userId } },
		{
			populate: ['customer', 'seller'],
			orderBy: { dateHour: 'DESC' },
		}
	)

	return {
		user: user,
		ratings,
		averageScore:
			ratings.length > 0
				? Number((ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length).toFixed(2))
				: 0,
	}
}

export async function getUserRatingsGiven(userId: number) {
	const user = await getUserById(userId)
	const ratings = await entityManager.find(
		Rating,
		{ customer: { id: userId } },
		{
			populate: ['customer', 'seller'],
			orderBy: { dateHour: 'DESC' },
		}
	)

	return {
		user: user,
		ratings,
	}
}
