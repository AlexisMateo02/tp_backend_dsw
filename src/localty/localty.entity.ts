import { Entity, Property, ManyToOne, Rel, Cascade, OneToMany, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Province } from '../province/province.entity.js'
import { PickUpPoint } from '../pickUpPoint/pickUpPoint.entity.js'

@Entity()
export class Localty extends BaseEntity {
	@Property({ nullable: false, unique: true })
	zipcode!: string

	@Property({ nullable: false, unique: true })
	name!: string

	@ManyToOne(() => Province, { nullable: false })
	province!: Rel<Province>

	@OneToMany(() => PickUpPoint, pickUpPoint => pickUpPoint.localty, { cascade: [], nullable: true })
	pickUpPoints = new Collection<PickUpPoint>(this)
}
