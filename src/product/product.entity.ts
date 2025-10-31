import { Entity, Property, ManyToOne, Rel, Enum, OneToMany, Collection, Cascade } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { User } from '../user/user.entity.js'
import { KayakType } from '../kayakType/kayakType.entity.js'
import { SUPType } from '../supType/supType.entity.js'
import { BoatType } from '../boatType/boatType.entity.js'
import { ArticleType } from '../articleType/articleType.entity.js'
import { OrderItem } from '../orderItem/orderItem.entity.js'
import { Review } from '../review/review.entity.js'

export enum ProductCategory {
	KAYAK = 'kayak',
	SUP = 'sup',
	EMBARCACION = 'embarcacion',
	ARTICULO = 'articulo',
}

@Entity()
export class Product extends BaseEntity {
	@Property({ nullable: false })
	Productname!: string

	@Property({ nullable: false })
	price!: string

	@Property({ nullable: true })
	oldPrice?: string

	@Property({ nullable: true })
	tag?: string

	@Enum(() => ProductCategory)
	category!: ProductCategory

	@Property({ type: 'int', nullable: false, default: 1 })
	stock: number = 1

	@Property({ nullable: false, type: 'text' })
	image!: string

	@Property({ nullable: true, type: 'text' })
	secondImage?: string

	@Property({ nullable: true, type: 'text' })
	thirdImage?: string

	@Property({ nullable: true, type: 'text' })
	fourthImage?: string

	@Property({ nullable: true, type: 'text' })
	description?: string

	@Property({ nullable: true, type: 'text' })
	includes?: string

	@Property({ type: 'boolean', nullable: false, default: false })
	approved: boolean = false

	@Property({ type: 'int', nullable: false, default: 0 })
	soldCount: number = 0

	@Property({ nullable: false })
	createdAt: Date = new Date()

	// Relaciones con tipos específicos
	@ManyToOne(() => KayakType, { nullable: true })
	kayakType?: Rel<KayakType>

	@ManyToOne(() => SUPType, { nullable: true })
	supType?: Rel<SUPType>

	@ManyToOne(() => BoatType, { nullable: true })
	boatType?: Rel<BoatType>

	@ManyToOne(() => ArticleType, { nullable: true })
	articleType?: Rel<ArticleType>

	//! Vendedor (null = producto oficial KBR)
	@ManyToOne(() => User, { nullable: true })
	seller?: Rel<User>

	@Property({ nullable: true })
	sellerName?: string

	@OneToMany(() => OrderItem, orderItem => orderItem.product, { cascade: [Cascade.ALL] })
	orderItems = new Collection<OrderItem>(this)

	@OneToMany(() => Review, review => review.product, { cascade: [Cascade.ALL] })
	reviews = new Collection<Review>(this)
}
