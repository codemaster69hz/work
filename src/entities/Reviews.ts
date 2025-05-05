import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "./User";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Product } from "./Products";

@ObjectType()
@Entity()
export class Review {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  id: string = crypto.randomUUID();

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  // @Property({nullable: true, hidden: true})
  // limit?: number;

  @Field(() => Product) // Link to Product, not Company
  @ManyToOne(() => Product)
  product!: Product; // Changed from Company to Product

  @Field(() => String)
  @Property({ type: 'text' })
  comment!: string;

  @Field(() => Int)
  @Property()
  rating!: number; // 1-5 scale

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
}