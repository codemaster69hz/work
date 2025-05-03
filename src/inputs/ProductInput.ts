import { InputType, Field, Float } from "type-graphql";
import { ProductVariationInput } from "../inputs/ProductVarInput";

@InputType()
export class ProductInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => Float)
  price!: number;

  @Field()
  subcategory!: string; 

  @Field()
  material!: string;

  @Field(() => String)
  category!: string;

  @Field(() => [ProductVariationInput], { nullable: true }) 
  variations?: ProductVariationInput[]; 

  @Field(() => Float, { nullable: true }) 
  weight?: number;
}
