import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { OrderItem } from './orderItem.entity.js'
import { Order } from '../order/order.entity.js'
import { Product } from '../product/product.entity.js'

const entityManager = orm.em

export async function getOrderItemById(id: number) {
	validateId(id, 'item de orden')
	const orderItem = await entityManager.findOne(OrderItem, { id }, { populate: ['order', 'product'] })
	if (!orderItem) {
		throw new Error(`El item de orden con el ID ${id} no fue encontrado`)
	}
	return orderItem
}

export async function getOrderItemsByOrder(orderId: number) {
	validateId(orderId, 'orden')
	return await entityManager.find(OrderItem, { order: orderId }, { populate: ['product'] })
}
