import { Entity, Property, ManyToOne, Rel, OneToMany, Collection, Cascade, Enum } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { User } from '../user/user.entity.js'
import { OrderItem } from '../orderItem/orderItem.entity.js'

export enum OrderStatus {
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	SHIPPED = 'shipped',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled',
}

export enum DeliveryType {
	SHIP = 'ship',
	PICKUP = 'pickup',
}

@Entity()
export class Order extends BaseEntity {
	@Property({ nullable: false, unique: true })
	orderNumber!: string

	@Property({ nullable: false })
	orderDate: Date = new Date()

	@Enum(() => OrderStatus)
	status: OrderStatus = OrderStatus.PENDING

	@Enum(() => DeliveryType)
	deliveryType!: DeliveryType

	@Property({ type: 'float', nullable: false })
	totalAmount!: number

	@Property({ type: 'float', nullable: false, default: 0 })
	shippingCost: number = 0

	@Property({ type: 'float', nullable: false, default: 0 })
	taxAmount: number = 0

	// Información del comprador
	@Property({ nullable: false })
	buyerName!: string

	@Property({ nullable: false })
	buyerEmail!: string

	@Property({ nullable: true })
	buyerPhone?: string

	// Dirección de envío
	@Property({ nullable: true })
	shippingAddress?: string

	@Property({ nullable: true })
	shippingCity?: string

	@Property({ nullable: true })
	shippingPostalCode?: string

	@Property({ nullable: true })
	shippingProvince?: string

	// Punto de retiro (si es pickup)
	@Property({ nullable: true })
	pickupPointId?: number

	// Notas adicionales
	@Property({ nullable: true, type: 'text' })
	notes?: string

	@ManyToOne(() => User, { nullable: true })
	user?: Rel<User>

	@OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: [Cascade.ALL] })
	items = new Collection<OrderItem>(this)
}
