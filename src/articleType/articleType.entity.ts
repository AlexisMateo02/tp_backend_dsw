import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";

@Entity()
export class ArticleType extends BaseEntity{
    @Property({ nullable: false, unique: true })
    name!: string;

    @Property({ nullable: false })
    mainUse!: string;
}