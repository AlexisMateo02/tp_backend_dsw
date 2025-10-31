import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Order } from '../order/order.entity.js'
import { Product } from '../product/product.entity.js'

@Entity()
export class OrderItem extends BaseEntity {
	@Property({ type: 'int', nullable: false })
	quantity!: number

	@Property({ nullable: false })
	priceAtPurchase!: string

	@Property({ type: 'float', nullable: false })
	subtotal!: number

	@Property({ nullable: false })
	productName!: string

	@Property({ nullable: true, type: 'text' })
	productImage?: string

	@Property({ nullable: true })
	sellerId?: number

	@Property({ nullable: true })
	sellerName?: string

	@ManyToOne(() => Order, { nullable: false })
	order!: Rel<Order>

	@ManyToOne(() => Product, { nullable: true })
	product?: Rel<Product>
}
