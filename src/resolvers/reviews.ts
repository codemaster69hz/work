// import { Resolver, Mutation, Query, Arg, Ctx, InputType, Field, Int } from "type-graphql";
// import { Review } from "../entities/Reviews";
// import { Product } from "../entities/Products";
// import { User } from "../entities/User";
// import { MyContext } from "../types";

// @InputType()
// class ReviewInput {
//   @Field(() => String) // Changed from Int to String since IDs are often strings
//   productId!: string;

//   @Field(() => String)
//   comment!: string;

//   @Field(() => Int)
//   rating!: number; // 1-5
// }

// @Resolver(() => Review)
// export class ReviewResolver {
//   // --------------------------
//   // MUTATIONS
//   // --------------------------

//   @Mutation(() => Review)
//   async createReview(
//     @Arg("input") input: ReviewInput,
//     @Ctx() { em, req }: MyContext
//   ): Promise<Review> {
//     if (!req.session.userId) throw new Error("Not authenticated");

//     // Validate rating
//     if (input.rating < 1 || input.rating > 5) {
//       throw new Error("Rating must be between 1-5");
//     }

//     const [user, product] = await Promise.all([
//       em.findOne(User, { id: req.session.userId }),
//       em.findOne(Product, { id: input.productId })
//     ]);

//     if (!user || !product) throw new Error("User or product not found");

//     // Check for existing review
//     const existingReview = await em.findOne(Review, {
//       user: user.id,
//       product: product.id
//     });
//     if (existingReview) throw new Error("You already reviewed this product");

//     // Initialize product review stats if undefined
//     if (product.averageRating === undefined) {
//       product.averageRating = 0;
//     }
//     if (product.reviewCount === undefined) {
//       product.reviewCount = 0;
//     }

//     // Create review
//     const review = em.create(Review, {
//       user,
//       product,
//       comment: input.comment,
//       rating: input.rating,
//       createdAt: new Date()
//     });

//     // Update product stats (optimized)
//     product.reviewCount += 1;
//     product.averageRating = Number((
//       (product.averageRating * (product.reviewCount - 1) + input.rating) / 
//       product.reviewCount
//     ).toFixed(1));

//     await em.persistAndFlush([review, product]);
//     return review;
//   }

//   // --------------------------
//   // QUERIES
//   // --------------------------

//   @Query(() => [Review])
//     async productReviews(
//     @Arg("productId") productId: string,
//     @Ctx() { em }: MyContext
//     ): Promise<Review[]> {
//     return em.find(
//         Review,
//         { 
//         product: productId,
//         },
//         { 
//         orderBy: { createdAt: 'DESC' },
//         populate: ['user'],
//         // actualLimit: 10 // Some older versions use this
//         }
//     );
//     }

//   // SAME QUERY BUT ONLY PAGINATION LOGIC IS IMPLEMENTED BELOW

//   // @Query(() => [Review])
//   // async productReviews(
//   //   @Arg("productId") productId: string,
//   //   @Arg("take", () => Int, { nullable: true }) take?: number,
//   //   @Arg("skip", () => Int, { nullable: true }) skip?: number,
//   //   @Ctx() { em }: MyContext
//   // ): Promise<Review[]> {
//   //   const allReviews = await em.find(
//   //     Review,
//   //     { product: productId },
//   //     { 
//   //       orderBy: { createdAt: 'DESC' },
//   //       populate: ['user']
//   //     }
//   //   );
    
//   //   // Manual pagination
//   //   return allReviews.slice(skip || 0, (skip || 0) + (take || allReviews.length));
//   // }

//   @Query(() => [Review])
//   async userReviews(
//     @Ctx() { em, req }: MyContext
//   ): Promise<Review[]> {
//     if (!req.session.userId) throw new Error("Not authenticated");
//     return em.find(Review, { user: req.session.userId }, {
//       populate: ['product']
//     });
//   }
// }