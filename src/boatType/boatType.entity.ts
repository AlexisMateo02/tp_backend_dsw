import { Entity, Property, OneToMany, Collection, Cascade, Unique } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Product } from '../product/product.entity.js'

@Entity()
@Unique({ properties: ['brand', 'model'] })
export class BoatType extends BaseEntity {
	@Property({ nullable: false })
	model!: string

	@Property({ nullable: false })
	brand!: string

	@Property({ nullable: false })
	boatCategory!: string

	@Property({ nullable: false })
	material!: string

	@Property({ type: 'int', nullable: false })
	passengerCapacity!: number

	@Property({ type: 'float', nullable: false })
	maxWeightCapacity!: number

	@Property({ type: 'float', nullable: false })
	length!: number

	@Property({ type: 'float', nullable: false })
	beam!: number

	@Property({ nullable: false })
	hullType!: string

	@Property({ nullable: true })
	motorType?: string

	@Property({ type: 'int', nullable: true })
	maxHorsePower?: number

	@OneToMany(() => Product, product => product.boatType, { cascade: [Cascade.ALL], nullable: true })
	products = new Collection<Product>(this)
}
