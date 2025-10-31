import { Entity, Property, OneToMany, Collection, Cascade, Enum } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Order } from '../order/order.entity.js'
import { Review } from '../review/review.entity.js'
import { Product } from '../product/product.entity.js'

export enum UserRole {
	CUSTOMER = 'customer',
	SELLER = 'seller',
	ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {
	@Property({ nullable: false })
	firstName!: string

	@Property({ nullable: false })
	lastName!: string

	@Property({ nullable: false, unique: true })
	email!: string

	@Property({ nullable: false })
	password!: string

	@Property({ nullable: true })
	phone?: string

	@Enum(() => UserRole)
	role: UserRole = UserRole.CUSTOMER

	@Property({ nullable: true })
	address?: string

	@Property({ nullable: true })
	city?: string

	@Property({ nullable: true })
	postalCode?: string

	//! Campos de Seller
	@Property({ nullable: true })
	businessName?: string

	@Property({ nullable: true, type: 'text' })
	businessDescription?: string

	@Property({ nullable: true })
	businessAddress?: string

	@Property({ nullable: true, type: 'text' })
	logo?: string

	@Property({ type: 'float', nullable: true, default: 5.0 })
	sellerRating?: number

	@Property({ type: 'int', nullable: true, default: 0 })
	totalReviews?: number

	@Property({ type: 'boolean', nullable: true, default: false })
	verified?: boolean

	@Property({ nullable: true })
	joinedAsSellerDate?: Date

	//! Relaciones
	@OneToMany(() => Order, order => order.user, { cascade: [Cascade.ALL] })
	orders = new Collection<Order>(this)

	@OneToMany(() => Review, review => review.user, { cascade: [Cascade.ALL] })
	reviews = new Collection<Review>(this)

	@OneToMany(() => Product, product => product.seller, { cascade: [Cascade.ALL] })
	sellerProducts = new Collection<Product>(this)
}
