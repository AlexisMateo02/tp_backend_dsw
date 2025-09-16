import { Entity, OneToMany, Property, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { Product } from "../product/product.entity.js";

@Entity()
export class ArticleType extends BaseEntity{
    @Property({ nullable: false, unique: true })
    name!: string;

    @Property({ nullable: false })
    mainUse!: string;

    @OneToMany(() => Product, (product) => product.articleType, {cascade: [Cascade.ALL], nullable: true})
    products = new Collection<Product>(this)

}