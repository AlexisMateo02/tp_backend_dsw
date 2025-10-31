import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { User } from '../user/user.entity.js'
import { Product } from '../product/product.entity.js'

@Entity()
export class Review extends BaseEntity {
	@Property({ nullable: false })
	name!: string

	@Property({ nullable: false, type: 'text' })
	text!: string

	@Property({ type: 'int', nullable: false, default: 5 })
	rating: number = 5 // 1-5 estrellas

	@Property({ nullable: false })
	date: Date = new Date()

	@ManyToOne(() => User, { nullable: true }) // nullable si permite reseñas sin login
	user?: Rel<User>

	@ManyToOne(() => Product, { nullable: false })
	product!: Rel<Product>
}
