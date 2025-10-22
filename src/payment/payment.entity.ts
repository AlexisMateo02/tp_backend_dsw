import { Entity, Property, OneToMany, Rel, Cascade, ManyToOne, PrimaryKey } from '@mikro-orm/core'
import type { Purchase } from '../purchase/purchase.entity.js'

@Entity()
export class Payment {
	@ManyToOne(() => 'Purchase', { primary: true })
	purchase!: Purchase

	@PrimaryKey()
	id!: number

	@Property({ nullable: false }) //ver!!!!
	date!: Date

	@Property({ nullable: false })
	method!: string
}
