import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { Review } from './review.entity.js'
import { User } from '../user/user.entity.js'
import { Product } from '../product/product.entity.js'

const entityManager = orm.em

interface ReviewCreateData {
	name: string
	text: string
	rating: number
	productId: number
	userId?: number
}

interface ReviewUpdateData {
	text?: string
	rating?: number
}

export async function getAllReviews() {
	return await entityManager.find(Review, {}, { populate: ['user', 'product'] })
}

export async function getReviewById(id: number) {
	validateId(id, 'reseña')
	const review = await entityManager.findOne(Review, { id }, { populate: ['user', 'product'] })
	if (!review) {
		throw new Error(`La reseña con el ID ${id} no fue encontrada`)
	}
	return review
}

export async function getReviewsByProduct(productId: number) {
	validateId(productId, 'producto')
	return await entityManager.find(Review, { product: productId }, { populate: ['user'], orderBy: { date: 'DESC' } })
}

export async function createReview(reviewData: ReviewCreateData) {
	// Validar rating
	if (reviewData.rating < 1 || reviewData.rating > 5) {
		throw new Error('La calificación debe estar entre 1 y 5')
	}

	// Obtener producto
	const product = await entityManager.findOne(Product, { id: reviewData.productId })
	if (!product) {
		throw new Error('Producto no encontrado')
	}

	// Obtener usuario si se especifica
	let user
	if (reviewData.userId) {
		user = await entityManager.findOne(User, { id: reviewData.userId })
		if (!user) {
			throw new Error('Usuario no encontrado')
		}
	}

	const review = entityManager.create(Review, {
		name: reviewData.name,
		text: reviewData.text,
		rating: reviewData.rating,
		product,
		user,
		date: new Date(),
	})

	await entityManager.flush()
	return review
}

export async function updateReview(id: number, reviewData: ReviewUpdateData) {
	const review = await getReviewById(id)

	if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
		throw new Error('La calificación debe estar entre 1 y 5')
	}

	entityManager.assign(review, reviewData)
	await entityManager.flush()
	return review
}

export async function deleteReview(id: number) {
	const review = await getReviewById(id)
	await entityManager.removeAndFlush(review)
	return true
}
