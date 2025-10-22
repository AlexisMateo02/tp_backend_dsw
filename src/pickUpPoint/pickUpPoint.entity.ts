import { Entity, Property, OneToMany, Rel, Cascade, ManyToOne } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Publishment } from '../publishment/publishment.entity.js'
import { Localty } from '../localty/localty.entity.js'

@Entity()
export class PickUpPoint extends BaseEntity {
	@Property({ nullable: false })
	adressStreet!: string

	@Property({ type: 'int', nullable: false })
	adressnumber!: number

	@Property({ type: 'int', nullable: true })
	adressFloor?: number

	@Property({ nullable: true })
	adressApartment?: string

	@Property({ type: 'int', nullable: true })
	tower?: number

	@OneToMany(() => Publishment, publishment => publishment.pickUpPoint, { cascade: [], nullable: true })
	publishments?: Rel<Publishment[]>

	@ManyToOne(() => Localty, { nullable: false })
	localty!: Rel<Localty>
}
