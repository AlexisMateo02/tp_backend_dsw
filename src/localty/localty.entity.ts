import { Entity, Property, PrimaryKey, ManyToOne, Rel, Cascade, OneToMany, Collection } from '@mikro-orm/core'
import { Province } from '../province/province.entity.js'
import { User } from '../user/user.entity.js'
import { PickUpPoint } from '../pickUpPoint/pickUpPoint.entity.js'

@Entity()
export class Localty {
	@PrimaryKey()
	zipcode!: string

	@Property({ nullable: false, unique: true })
	name!: string

	@ManyToOne(() => Province, { nullable: false })
	province!: Rel<Province>

	@OneToMany(() => User, user => user.localty, {
		cascade: [],
		nullable: true,
	})
	users = new Collection<User>(this)

	@OneToMany(() => PickUpPoint, pickUpPoint => pickUpPoint.localty, { cascade: [], nullable: true })
	pickUpPoints = new Collection<PickUpPoint>(this)
}
