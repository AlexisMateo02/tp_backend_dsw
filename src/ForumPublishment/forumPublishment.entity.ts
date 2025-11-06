import { Entity, Property, ManyToOne, Rel, Cascade, Enum } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { User } from '../user/user.entity.js'

export enum PublicationStatus {
	ACTIVE = 'active',
	SOLD = 'sold',
	EXPIRED = 'expired',
}

@Entity()
export class ForumPublishment extends BaseEntity {
	@Property({ nullable: false })
	title!: string

	@Property({ nullable: false, type: 'text' })
	content!: string

	@Property({ nullable: false })
	contactInfo!: string

	@Property({ type: 'json', nullable: true })
	images?: string[]

	@Enum(() => PublicationStatus)
	status: PublicationStatus = PublicationStatus.ACTIVE

	@Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	price?: number

	@ManyToOne(() => User, {
		nullable: false,
		cascade: [Cascade.REMOVE],
		eager: true,
	})
	author!: Rel<User>

	@Property({ onCreate: () => new Date() })
	createdAt?: Date

	@Property({ onUpdate: () => new Date() })
	updatedAt?: Date
}
