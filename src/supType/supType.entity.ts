import { Entity, Property, OneToMany, Collection, Cascade, Unique } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Product } from '../product/product.entity.js'

@Entity()
@Unique({ properties: ['brand', 'model'] })
export class SUPType extends BaseEntity {
	@Property({ nullable: false })
	model!: string

	@Property({ nullable: false })
	brand!: string

	@Property({ nullable: false })
	material!: string

	@Property({ type: 'int', nullable: false })
	paddlersQuantity!: number

	@Property({ type: 'float', nullable: false })
	maxWeightCapacity!: number

	@Property({ nullable: false })
	constructionType!: string

	@Property({ type: 'float', nullable: false })
	length!: number

	@Property({ type: 'float', nullable: false })
	width!: number

	@Property({ type: 'float', nullable: false })
	thickness!: number

	@Property({ nullable: false })
	boardType!: string

	@Property({ nullable: true })
	finConfiguration?: string

	@OneToMany(() => Product, product => product.supType, { cascade: [Cascade.ALL], nullable: true })
	products = new Collection<Product>(this)
}
