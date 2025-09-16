import { Entity, Property, OneToMany, ManyToOne, Rel, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { Localty } from "../localty/localty.entity.js";
import { Purchase } from "../purchase/purchase.entity.js";
import { Publishment } from "../publishment/publishment.entity.js";

@Entity()
export class User extends BaseEntity{

    @Property({ nullable: false })
    firstName!: string;

    @Property({ nullable: false })
    lastName!: string;

    @Property({ nullable: false, unique: true })
    email!: string;

    @Property({ nullable: false })
    password!: string;

    @Property({ type: 'int', nullable: true })
    sellsQuantity?: number;

    @Property({ nullable: true })
    sellerType?: string;

    @ManyToOne (() => Localty , { nullable: false })
    localty!: Rel<Localty>;

    @OneToMany(() => Purchase, (purchase) => purchase.user, { cascade: [Cascade.ALL],nullable: true })
    purchases!: Rel<Purchase[]>;

    
    @OneToMany(() => Publishment, (publishment) => publishment.user, {  cascade: [Cascade.ALL], nullable: true })
    publishments!: Rel<Purchase[]>;
}
