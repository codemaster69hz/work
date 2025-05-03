import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Field,
  InputType,
} from "type-graphql";
import { Category } from "../entities/Category";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";
import { MyContext } from "../types";
import { FieldError } from "../shared/ferror";

@InputType()
class CategoryInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  parentCategoryId?: string;
}

@ObjectType()
class CategoryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Category, { nullable: true })
  category?: Category;
}

@Resolver(Category)
export class CategoryResolver {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>
  ) {}

  @Query(() => [Category])
  async categories(@Ctx() { em }: MyContext): Promise<Category[]> {
    return await em.find(Category, {}, { populate: ["subcategories"] });
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("id") id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({ id }, { populate: ["products"] });
  }

  @Query(() => [Category])
  async subcategories(
    @Arg("parentCategoryId") parentCategoryId: string,
    @Ctx() { em }: MyContext
  ): Promise<Category[]> {
    return await em.find(Category, { parentCategory: parentCategoryId });
  }

  @Query(() => [Category])
  async parentCategories(@Ctx() { em }: MyContext): Promise<Category[]> {
    return await em.find(Category, { parentCategory: null });
  }

  @Mutation(() => CategoryResponse)
    async createCategory(
      @Arg("options") options: CategoryInput,
      @Ctx() { em }: MyContext
    ): Promise<CategoryResponse> {
      const trimmedName = options.name.trim();
      // const normalizedName = trimmedName.toLowerCase();

      let parentCategory = null;

      if (options.parentCategoryId) {
        parentCategory = await em.findOne(Category, { id: options.parentCategoryId });
        if (!parentCategory) {
          return {
            errors: [
              {
                field: "parentCategoryId",
                message: "Parent category not found",
              },
            ],
          };
        }
      }

      // Check for existing category with same normalized name and same parent
      const existingCategory = await em.findOne(Category, {
        name: { $ilike: trimmedName }, // case-insensitive search
        parentCategory: parentCategory ?? null,
      });

      if (existingCategory) {
        return {
          errors: [
            {
              field: "name",
              message: `Category '${trimmedName}' already exists${parentCategory ? " under this parent category" : ""}`,
            },
          ],
        };
      }

      const category = em.create(Category, {
        name: trimmedName,
        parentCategory: parentCategory ?? null,
      });

      await em.persistAndFlush(category);

      return { category };
    }

}
