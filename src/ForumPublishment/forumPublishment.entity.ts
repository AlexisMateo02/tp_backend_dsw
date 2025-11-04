
import { Entity, Property, ManyToOne, Rel, Cascade } from '@mikro-orm/core'
import { BaseEntity } from '../shared/dataBase/baseEntity.js'
import { User } from '../user/user.entity.js'

@Entity()
export class forumPublishment extends BaseEntity {
    @Property({ nullable: false })
    title!: string

    @Property({ nullable: false, type: 'text' })
    content!: string

    @Property({ nullable: false })
    contactInfo!: string

    @ManyToOne(() => User, { nullable: false, cascade: [Cascade.PERSIST] })
    author!: Rel<User>

    @Property({ onCreate: () => new Date() })
    createdAt?: Date

    @Property({ onUpdate: () => new Date() })
    updatedAt?: Date
}