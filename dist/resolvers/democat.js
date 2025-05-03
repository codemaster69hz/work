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
exports.CategoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../entities/Category");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@mikro-orm/core");
const ferror_1 = require("../shared/ferror");
let CategoryInput = class CategoryInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CategoryInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CategoryInput.prototype, "parentCategoryId", void 0);
CategoryInput = __decorate([
    (0, type_graphql_1.InputType)()
], CategoryInput);
let CategoryResponse = class CategoryResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [ferror_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], CategoryResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Category_1.Category, { nullable: true }),
    __metadata("design:type", Category_1.Category)
], CategoryResponse.prototype, "category", void 0);
CategoryResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CategoryResponse);
let CategoryResolver = class CategoryResolver {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async categories({ em }) {
        if (!em)
            throw new Error("EntityManager not found in context");
        return await em.findAll(Category_1.Category, { populate: ["subcategories"] });
    }
    async category(id, {}) {
        return await this.categoryRepository.findOne({ id }, { populate: ["products", "subcategories"] });
    }
    async subcategories(parentCategoryId) {
        return await this.categoryRepository.find({ parentCategory: parentCategoryId });
    }
    async createCategory(options, { em }) {
        const existingCategory = await this.categoryRepository.findOne({ name: options.name });
        if (existingCategory) {
            return { errors: [{ field: "name", message: "This category already exists" }] };
        }
        let parentCategory = null;
        if (options.parentCategoryId) {
            parentCategory = await this.categoryRepository.findOne({ id: options.parentCategoryId });
            if (!parentCategory) {
                return { errors: [{ field: "parentCategoryId", message: "Parent category not found" }] };
            }
        }
        const category = this.categoryRepository.create({
            name: options.name,
            parentCategory: parentCategory || null,
        });
        await em.persistAndFlush(category);
        return { category };
    }
};
exports.CategoryResolver = CategoryResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Category_1.Category]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "categories", null);
__decorate([
    (0, type_graphql_1.Query)(() => Category_1.Category),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "category", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Category_1.Category]),
    __param(0, (0, type_graphql_1.Arg)("parentCategoryId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "subcategories", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => CategoryResponse),
    __param(0, (0, type_graphql_1.Arg)("options")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryInput, Object]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
exports.CategoryResolver = CategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)(Category_1.Category),
    __param(0, (0, nestjs_1.InjectRepository)(Category_1.Category)),
    __metadata("design:paramtypes", [core_1.EntityRepository])
], CategoryResolver);
//# sourceMappingURL=democat.js.map