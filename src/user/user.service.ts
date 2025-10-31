import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { User, UserRole } from './user.entity.js'
import { Order } from '../order/order.entity.js'
import { Product } from '../product/product.entity.js'
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
	address?: string
	city?: string
	postalCode?: string
}

interface SellerRegistrationData {
	firstName: string
	lastName: string
	email: string
	password: string
	phone: string
	businessName: string
	businessDescription?: string
	businessAddress: string
	logo?: string
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

export async function registerSeller(sellerData: SellerRegistrationData) {
	const existingUser = await entityManager.findOne(User, { email: sellerData.email })
	if (existingUser) {
		throw new Error(`El email '${sellerData.email}' ya está registrado`)
	}

	const hashedPassword = await bcrypt.hash(sellerData.password, 10)

	const seller = entityManager.create(User, {
		firstName: sellerData.firstName,
		lastName: sellerData.lastName,
		email: sellerData.email,
		password: hashedPassword,
		phone: sellerData.phone,
		role: UserRole.SELLER,
		businessName: sellerData.businessName,
		businessDescription: sellerData.businessDescription,
		businessAddress: sellerData.businessAddress,
		logo: sellerData.logo,
		sellerRating: 5.0,
		totalReviews: 0,
		verified: false,
		joinedAsSellerDate: new Date(),
	})

	await entityManager.flush()
	return seller
}

export async function updateUser(id: number, userData: UserUpdateData) {
	const user = await getUserById(id)

	if (userData.email && userData.email !== user.email) {
		const existingUser = await entityManager.findOne(User, { email: userData.email })
		if (existingUser) {
			throw new Error(`El email '${userData.email}' ya está registrado`)
		}
	}

	entityManager.assign(user, userData)
	await entityManager.flush()
	return user
}

export async function verifySeller(id: number) {
	const seller = await getUserById(id)

	if (seller.role !== UserRole.SELLER) {
		throw new Error('El usuario no es un vendedor')
	}

	seller.verified = true
	await entityManager.flush()
	return seller
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

	// Si es vendedor, verificar productos
	if (user.role === UserRole.SELLER) {
		const productCount = await entityManager.count(Product, { seller: user.id })
		if (productCount > 0) {
			throw new Error(
				`El vendedor tiene ${productCount} producto${productCount > 1 ? 's' : ''} publicado${productCount > 1 ? 's' : ''}`
			)
		}
	}

	await entityManager.removeAndFlush(user)
	return true
}
