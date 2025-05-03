import { InputType, Field, Float } from "type-graphql";

@InputType()
export class ProductVariationInput {
  @Field()
  size!: string;

  @Field()
  color!: string;

  @Field(() => Float)
  price!: number;
}
