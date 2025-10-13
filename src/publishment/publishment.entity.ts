import { Entity, Property, Rel, ManyToOne, Collection, ManyToMany } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { Product } from "../product/product.entity.js";
import { User } from "../user/user.entity.js";
import { PickUpPoint } from "../pickUpPoint/pickUpPoint.entity.js";

@Entity()
export class Publishment extends BaseEntity{
    @Property({ nullable: false })
    datePublishment!: Date;

    @Property({ nullable: false })
    status!: string; 

    @Property({ type: 'float', nullable: false })
    price!: number; // ← precioPublicacion del diagrama

    // 🟡 CORRECCIÓN: Relación ManyToMany con Product
    @ManyToMany(() => Product, product => product.publishments, {
        owner: true,
        nullable: false
    })
    products = new Collection<Product>(this);

    // 🟡 CORRECCIÓN: User debería ser Vendedor específicamente
    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;

    @ManyToOne(() => PickUpPoint, { nullable: false })
    pickUpPoint!: Rel<PickUpPoint>;

    // ❌ REMOVER: La relación con Purchase va en Purchase, no aquí
    // @ManyToOne(() => Purchase, { nullable: true })
    // purchase?: Rel<Purchase>;
}