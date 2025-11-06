import { Entity, Property, ManyToOne, OneToMany,Collection, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Localty } from '../localty/localty.entity.js'
import { Order } from '../order/order.entity.js'

@Entity()
export class PickUpPoint extends BaseEntity {

	@Property({ nullable: true })
	storeName?: string

	@Property({ nullable: false })
	address!: string

	@Property({ nullable: true, type: 'text' })
	adressDescription?: string //'piso', 'entre calles',etc

	@Property({ nullable: true })
	phoneNumber?: string

	@Property({ nullable: true })
	horary?: string


	@ManyToOne(() => Localty, { nullable: false })
	localty!: Rel<Localty>

	@OneToMany(() => Order, order => order.pickUpPoint)
	orders = new Collection<Order>(this)
}
