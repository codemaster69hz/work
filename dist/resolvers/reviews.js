"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Reviews_1 = require("../entities/Reviews");
const Products_1 = require("../entities/Products");
const User_1 = require("../entities/User");
let ReviewInput = class ReviewInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ReviewInput.prototype, "productId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ReviewInput.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], ReviewInput.prototype, "rating", void 0);
ReviewInput = __decorate([
    (0, type_graphql_1.InputType)()
], ReviewInput);
let ReviewResolver = class ReviewResolver {
    async createReview(input, { em, req }) {
        if (!req.session.userId)
            throw new Error("Not authenticated");
        if (input.rating < 1 || input.rating > 5) {
            throw new Error("Rating must be between 1-5");
        }
        const [user, product] = await Promise.all([
            em.findOne(User_1.User, { id: req.session.userId }),
            em.findOne(Products_1.Product, { id: input.productId })
        ]);
        if (!user || !product)
            throw new Error("User or product not found");
        const existingReview = await em.findOne(Reviews_1.Review, {
            user: user.id,
            product: product.id
        });
        if (existingReview)
            throw new Error("You already reviewed this product");
        if (product.averageRating === undefined) {
            product.averageRating = 0;
        }
        if (product.reviewCount === undefined) {
            product.reviewCount = 0;
        }
        const review = em.create(Reviews_1.Review, {
            user,
            product,
            comment: input.comment,
            rating: input.rating,
            createdAt: new Date()
        });
        product.reviewCount += 1;
        product.averageRating = Number(((product.averageRating * (product.reviewCount - 1) + input.rating) /
            product.reviewCount).toFixed(1));
        await em.persistAndFlush([review, product]);
        return review;
    }
    async productReviews(productId, { em }) {
        return em.find(Reviews_1.Review, {
            product: productId,
        }, {
            orderBy: { createdAt: 'DESC' },
            populate: ['user'],
        });
    }
    async userReviews({ em, req }) {
        if (!req.session.userId)
            throw new Error("Not authenticated");
        return em.find(Reviews_1.Review, { user: req.session.userId }, {
            populate: ['product']
        });
    }
};
exports.ReviewResolver = ReviewResolver;
__decorate([
    (0, type_graphql_1.Mutation)(() => Reviews_1.Review),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReviewInput, Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "createReview", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Reviews_1.Review]),
    __param(0, (0, type_graphql_1.Arg)("productId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "productReviews", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Reviews_1.Review]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewResolver.prototype, "userReviews", null);
exports.ReviewResolver = ReviewResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Reviews_1.Review)
], ReviewResolver);
//# sourceMappingURL=reviews.js.map