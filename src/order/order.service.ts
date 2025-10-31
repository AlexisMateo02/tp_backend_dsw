import { orm } from '../shared/dataBase/orm.js'
import { validateId } from '../shared/utils/validationId.js'
import { Order, OrderStatus, DeliveryType } from './order.entity.js'
import { OrderItem } from '../orderItem/orderItem.entity.js'
import { User } from '../user/user.entity.js'
import { Product } from '../product/product.entity.js'

const entityManager = orm.em

interface OrderCreateData {
	deliveryType: DeliveryType
	totalAmount: number
	shippingCost?: number
	taxAmount?: number
	buyerName: string
	buyerEmail: string
	buyerPhone?: string
	shippingAddress?: string
	shippingCity?: string
	shippingPostalCode?: string
	shippingProvince?: string
	pickupPointId?: number
	notes?: string
	userId?: number
	items: Array<{
		productId: number
		quantity: number
		priceAtPurchase: string
	}>
}

interface OrderUpdateData {
	status?: OrderStatus
	notes?: string
}

export async function getAllOrders() {
	return await entityManager.find(Order, {}, { populate: ['user', 'items', 'items.product'] })
}

export async function getOrderById(id: number) {
	validateId(id, 'orden')
	const order = await entityManager.findOne(Order, { id }, { populate: ['user', 'items', 'items.product'] })
	if (!order) {
		throw new Error(`La orden con el ID ${id} no fue encontrada`)
	}
	return order
}

export async function getOrdersByUser(userId: number) {
	validateId(userId, 'usuario')
	return await entityManager.find(Order, { user: userId }, { populate: ['items', 'items.product'] })
}

export async function createOrder(orderData: OrderCreateData) {
	// Generar número de orden único
	const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

	// Obtener usuario si se especifica
	let user
	if (orderData.userId) {
		user = await entityManager.findOne(User, { id: orderData.userId })
		if (!user) {
			throw new Error('Usuario no encontrado')
		}
	}

	// Crear la orden
	const order = entityManager.create(Order, {
		orderNumber,
		deliveryType: orderData.deliveryType,
		totalAmount: orderData.totalAmount,
		shippingCost: orderData.shippingCost || 0,
		taxAmount: orderData.taxAmount || 0,
		buyerName: orderData.buyerName,
		buyerEmail: orderData.buyerEmail,
		buyerPhone: orderData.buyerPhone,
		shippingAddress: orderData.shippingAddress,
		shippingCity: orderData.shippingCity,
		shippingPostalCode: orderData.shippingPostalCode,
		shippingProvince: orderData.shippingProvince,
		pickupPointId: orderData.pickupPointId,
		notes: orderData.notes,
		user,
		status: OrderStatus.PENDING,
		orderDate: new Date(),
	})

	await entityManager.persistAndFlush(order)

	// Crear items de la orden
	for (const itemData of orderData.items) {
		const product = await entityManager.findOne(Product, { id: itemData.productId })
		if (!product) {
			throw new Error(`Producto con ID ${itemData.productId} no encontrado`)
		}

		// Verificar stock
		if (product.stock < itemData.quantity) {
			throw new Error(`Stock insuficiente para el producto '${product.Productname}'`)
		}

		// Calcular subtotal
		const priceValue = parseFloat(itemData.priceAtPurchase.replace(/[^\d.]/g, ''))
		const subtotal = priceValue * itemData.quantity

		// Crear item
		const orderItem = entityManager.create(OrderItem, {
			order,
			product,
			quantity: itemData.quantity,
			priceAtPurchase: itemData.priceAtPurchase,
			subtotal,
			productName: product.Productname,
			productImage: product.image,
			sellerId: product.seller?.id,
			sellerName: product.sellerName,
		})

		// Actualizar stock y ventas del producto
		product.stock -= itemData.quantity
		product.soldCount += itemData.quantity
	}

	await entityManager.flush()
	return order
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
	const order = await getOrderById(id)
	order.status = status
	await entityManager.flush()
	return order
}

export async function deleteOrder(id: number) {
	const order = await getOrderById(id)

	// Restaurar stock de productos
	await order.items.loadItems()
	for (const item of order.items) {
		if (item.product) {
			item.product.stock += item.quantity
			item.product.soldCount -= item.quantity
		}
	}

	await entityManager.removeAndFlush(order)
	return true
}
