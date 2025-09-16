import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/dataBase/baseEntity.js";
import { ArticleType } from "../articleType/articleType.entity.js";
import { KayakType } from "../kayakType/kayakType.entity.js";
import { Publishment } from "../publishment/publishment.entity.js";

@Entity()
export class Product extends BaseEntity{
    @Property({ nullable: false })
    name!: string;

    @Property({ nullable: false })
    description!: string;

    @Property({ type: 'float', nullable: false })
    price!: number; 

    @Property({ type: 'int', nullable: false })
    quantity!: number;

    @ManyToOne (() => ArticleType, { nullable: true })
    articleType!: Rel<ArticleType>;

    @ManyToOne (() => KayakType, { nullable: true })
    kayakType?: Rel<KayakType>;

    @ManyToOne (() => Publishment , { nullable: false })
    publishment!: Rel<Publishment>;
}

