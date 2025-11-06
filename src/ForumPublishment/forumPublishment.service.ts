import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { ForumPublishment, PublicationStatus } from './forumPublishment.entity.js'
import { User } from '../user/user.entity.js'

const entityManager = orm.em

interface ForumPublishmentCreateData {
	title: string
	content: string
	contactInfo: string
	authorId: number
	images?: string[]
	price?: number
	status?: PublicationStatus
}

interface ForumPublishmentUpdateData extends Partial<ForumPublishmentCreateData> {}

export async function getAllForumPublishments() {
	return await entityManager.find(
		ForumPublishment,
		{},
		{
			populate: ['author'],
			orderBy: { createdAt: 'DESC' },
		}
	)
}

export async function getForumPublishmentById(id: number) {
	validateId(id, 'publicación')

	const publishment = await entityManager.findOne(
		ForumPublishment,
		{ id },
		{
			populate: ['author'],
		}
	)

	if (!publishment) {
		throw new Error(`La publicación con el ID ${id} no fue encontrada`)
	}

	return publishment
}

export async function getForumPublishmentsByAuthor(authorId: number) {
	validateId(authorId, 'autor')

	const author = await entityManager.findOne(User, { id: authorId })
	if (!author) {
		throw new Error(`El autor con ID ${authorId} no existe`)
	}

	return await entityManager.find(
		ForumPublishment,
		{ author: authorId },
		{
			populate: ['author'],
			orderBy: { createdAt: 'DESC' },
		}
	)
}

export async function getForumPublishmentsByStatus(status: PublicationStatus) {
	return await entityManager.find(
		ForumPublishment,
		{ status },
		{
			populate: ['author'],
			orderBy: { createdAt: 'DESC' },
		}
	)
}

export async function getActiveForumPublishments() {
	return await getForumPublishmentsByStatus(PublicationStatus.ACTIVE)
}

export async function getSoldForumPublishments() {
	return await getForumPublishmentsByStatus(PublicationStatus.SOLD)
}

export async function getExpiredForumPublishments() {
	return await getForumPublishmentsByStatus(PublicationStatus.EXPIRED)
}

export async function createForumPublishment(publishmentData: ForumPublishmentCreateData) {
	// Validar datos requeridos
	if (!publishmentData.title || !publishmentData.content || !publishmentData.contactInfo) {
		throw new Error('Todos los campos son requeridos: título, contenido e información de contacto')
	}

	// Validar y obtener el autor (entidad padre)
	const author = await entityManager.findOne(User, { id: publishmentData.authorId })
	if (!author) {
		throw new Error(`El autor con ID ${publishmentData.authorId} no existe`)
	}

	const publishment = entityManager.create(ForumPublishment, {
		title: publishmentData.title,
		content: publishmentData.content,
		contactInfo: publishmentData.contactInfo,
		author: author,
		images: publishmentData.images || [],
		price: publishmentData.price,
		status: publishmentData.status || PublicationStatus.ACTIVE,
		createdAt: new Date(),
		updatedAt: new Date(),
	})

	await entityManager.flush()
	return publishment
}

export async function updateForumPublishment(id: number, publishmentData: ForumPublishmentUpdateData) {
	const publishment = await getForumPublishmentById(id)

	// Si se cambia el autor, validar que existe
	if (publishmentData.authorId) {
		const author = await entityManager.findOne(User, { id: publishmentData.authorId })
		if (!author) {
			throw new Error(`El autor con ID ${publishmentData.authorId} no existe`)
		}
		publishment.author = author
	}

	if (publishmentData.title !== undefined) publishment.title = publishmentData.title
	if (publishmentData.content !== undefined) publishment.content = publishmentData.content
	if (publishmentData.contactInfo !== undefined) publishment.contactInfo = publishmentData.contactInfo
	if (publishmentData.images !== undefined) publishment.images = publishmentData.images
	if (publishmentData.price !== undefined) publishment.price = publishmentData.price
	if (publishmentData.status !== undefined) publishment.status = publishmentData.status

	publishment.updatedAt = new Date()

	await entityManager.flush()
	return publishment
}

export async function deleteForumPublishment(id: number) {
	const publishment = await getForumPublishmentById(id)
	await entityManager.removeAndFlush(publishment)
	return true
}

export async function deleteForumPublishmentsByAuthor(authorId: number) {
	validateId(authorId, 'autor')

	const author = await entityManager.findOne(User, { id: authorId })
	if (!author) {
		throw new Error(`El autor con ID ${authorId} no existe`)
	}

	const publishments = await entityManager.find(ForumPublishment, { author: authorId })

	if (publishments.length > 0) {
		await entityManager.removeAndFlush(publishments)
	}

	return true
}
