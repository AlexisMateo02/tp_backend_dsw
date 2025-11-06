import { Entity, Property, ManyToOne, Rel, OneToMany, Collection, Cascade, Enum } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { User } from '../user/user.entity.js'
import { OrderItem } from '../orderItem/orderItem.entity.js'
import { PickUpPoint } from '../pickUpPoint/pickUpPoint.entity.js'

export enum OrderStatus {
	PENDING = 'pending',
	CONFIRMED = 'confirmed',
	SHIPPED = 'shipped',
	DELIVERED = 'delivered',
	CANCELLED = 'cancelled',
}


@Entity()
export class Order extends BaseEntity {
	@Property({ nullable: false, unique: true })
	orderNumber!: string

	@Property({ nullable: false })
	orderDate: Date = new Date()

	@Enum(() => OrderStatus)
	status: OrderStatus = OrderStatus.PENDING

	@Property({ type: 'float', nullable: false })
	totalAmount!: number

	// Información del comprador

	@Property({ nullable: false })
	buyerContact!: string // teléfono o email

	// Notas adicionales
	@Property({ nullable: true, type: 'text' })
	notes?: string

	@ManyToOne(() => User, { nullable: true })
	user?: Rel<User>

	@OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: [Cascade.ALL] })
	items = new Collection<OrderItem>(this)

	@ManyToOne(() => PickUpPoint, { nullable: true })
	pickUpPoint?: Rel<PickUpPoint>
}
