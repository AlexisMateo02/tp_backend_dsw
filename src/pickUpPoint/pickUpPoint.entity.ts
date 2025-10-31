import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { Localty } from '../localty/localty.entity.js'

@Entity()
export class PickUpPoint extends BaseEntity {
	@Property({ nullable: false })
	name!: string

	@Property({ nullable: false })
	address!: string

	@Property({ nullable: true })
	phone?: string

	@Property({ nullable: true })
	email?: string

	@Property({ nullable: true, type: 'text' })
	description?: string

	@Property({ nullable: true })
	openingHours?: string // Ej: "Lun-Vie: 9:00-18:00"

	@Property({ nullable: true, type: 'text' })
	imageUrl?: string

	@Property({ type: 'float', nullable: true })
	latitude?: number

	@Property({ type: 'float', nullable: true })
	longitude?: number

	@Property({ type: 'boolean', nullable: false, default: true })
	active: boolean = true

	@ManyToOne(() => Localty, { nullable: false })
	localty!: Rel<Localty>
}
