import { Entity, Property, OneToMany, ManyToOne, Rel, Cascade, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Localty } from '../localty/localty.entity.js'
import { Purchase } from '../purchase/purchase.entity.js'
import { Publishment } from '../publishment/publishment.entity.js'
import type { Rating } from '../rating/rating.entity.js'

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

	@Property({ type: 'int', nullable: true })
	sellsQuantity?: number

	@Property({ nullable: true })
	sellerType?: string

	// @Property({ nullable: false })
	// role!: string

	@ManyToOne(() => Localty, { nullable: false })
	localty!: Rel<Localty>

	@OneToMany(() => Purchase, purchase => purchase.user, { cascade: [Cascade.ALL], nullable: true })
	purchases!: Rel<Purchase[]>

	@OneToMany(() => Publishment, publishment => publishment.user, { cascade: [Cascade.ALL], nullable: true })
	publishments!: Rel<Publishment[]>

	@OneToMany(() => 'Rating', 'customer')
	ratingsGiven = new Collection<Rating>(this)

	@OneToMany(() => 'Rating', 'seller')
	ratingsReceived = new Collection<Rating>(this)
}
