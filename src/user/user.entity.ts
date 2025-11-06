import { Entity, Property, OneToMany, Collection, Cascade, Enum } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Order } from '../order/order.entity.js'
import { Review } from '../review/review.entity.js'

export enum UserRole {
	CUSTOMER = 'customer',
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


	//! Relaciones
	@OneToMany(() => Order, order => order.user, { cascade: [Cascade.ALL] })
	orders = new Collection<Order>(this)

	@OneToMany(() => Review, review => review.user, { cascade: [Cascade.ALL] })
	reviews = new Collection<Review>(this)

}
