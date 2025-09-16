import { Entity, Property, OneToMany, Rel, ManyToOne, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { Purchase } from "../purchase/purchase.entity.js";
import { Product } from "../product/product.entity.js";
import { User } from "../user/user.entity.js";
import { PickUpPoint } from "../pickUpPoint/pickUpPoint.entity.js";


@Entity()
export class Publishment extends BaseEntity{
    @Property({ nullable: false })
    datePublishment!: Date;

    @Property({nullable: false})
    status!: string; 

    @OneToMany (( ) => Product , (product) => product.publishment, { cascade: [Cascade.ALL],nullable: false})
    products!: Rel<Product[]>; 

    @ManyToOne (() => Purchase, { nullable: true })
    purchase?: Rel<Purchase>;

    @ManyToOne (() => User, { nullable: false })
    user!: Rel<User>;
    
    @ManyToOne (() => PickUpPoint, { nullable: false })
    pickUpPoint!: Rel<PickUpPoint>;
}