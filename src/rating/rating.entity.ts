import { Entity, Property, ManyToOne, PrimaryKey, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { User } from "../user/user.entity.js";

@Entity()
export class Rating extends BaseEntity {

  @ManyToOne(() => User)
  customer!: User;

  @ManyToOne(() => User)
  seller!: User;

  @Property()
  dateHour: Date = new Date();

  @Property({ type: 'int', nullable: false })
  score!: number; // 1-5

  @Property({ nullable: true })
  comment?: string;

}