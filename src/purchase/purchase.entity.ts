import { Entity, Property, ManyToOne, Rel, OneToMany, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { Publishment } from "../publishment/publishment.entity.js";
import { User } from "../user/user.entity.js";
import { Payment } from "../payment/payment.entity.js";

@Entity()
export class Purchase extends BaseEntity{
    @Property({ nullable: false })
    datePurchase!: Date;

    @Property({ nullable: false })
    status!: string;

    @Property({ type: 'int', nullable: false })
    totalPayment!: number;

    @ManyToOne (() => User, { nullable: false })
    user!: Rel<User>;

    @OneToMany (() => Publishment , (publishment) => publishment.purchase, { nullable: false})
    publishments!: Rel<Publishment[]>;

    @OneToMany (() => Payment , payment => payment.purchase, { cascade:[Cascade.ALL],nullable: true}) 
    payments?: Rel<Payment[]>;
}