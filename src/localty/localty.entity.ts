import { Entity, Property, PrimaryKey, ManyToOne, Rel } from "@mikro-orm/core";
import { Province } from "../province/province.entity.js";

@Entity()
export class Localty{
    @PrimaryKey()
    zipcode?: string;

    @Property({ nullable: false, unique: true })
    name!: string;

    @ManyToOne (() => Province, { nullable: false })
    province!: Rel<Province>;
}