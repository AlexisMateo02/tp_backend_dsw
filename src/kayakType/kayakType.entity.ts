import { Entity, OneToMany, Property, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { Product } from "../product/product.entity.js";

@Entity()
export class KayakType extends BaseEntity{
    @Property({ nullable: false, unique: true })
    model!: string;
    
    @Property({ nullable: false})
    brand!: string;

    @Property({ nullable: false })
    material!: string;

    @Property({ type: 'int', nullable: false })
    paddlersQuantity!: number;

    @Property({  type: 'float', nullable: false })
    maxWeightCapacity!: number;

    @Property({ nullable: false })
    constructionType!: string;

    @Property({ type: 'float', nullable: false })
    length!: number;

    @Property({ type: 'float', nullable: false })
    beam!: number;

    @OneToMany(() => Product, (product) => product.kayakType, { cascade: [Cascade.ALL],nullable: true})
    products = new Collection<Product>(this)
}