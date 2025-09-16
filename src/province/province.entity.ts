import { Entity, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { Localty } from "../localty/localty.entity.js";

@Entity()
export class Province extends BaseEntity{
    @Property({ nullable: false, unique: true })
    name!: string;

    @Property({ nullable: false })
    country!: string;

    @OneToMany(() => Localty, (localty) => localty.province, {
    cascade: [Cascade.ALL],
  })
    localties = new Collection<Localty>(this)
}
