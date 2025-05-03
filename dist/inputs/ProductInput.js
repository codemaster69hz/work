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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInput = void 0;
const type_graphql_1 = require("type-graphql");
const ProductVarInput_1 = require("../inputs/ProductVarInput");
let ProductInput = class ProductInput {
};
exports.ProductInput = ProductInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], ProductInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductInput.prototype, "subcategory", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ProductInput.prototype, "material", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProductInput.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ProductVarInput_1.ProductVariationInput], { nullable: true }),
    __metadata("design:type", Array)
], ProductInput.prototype, "variations", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], ProductInput.prototype, "weight", void 0);
exports.ProductInput = ProductInput = __decorate([
    (0, type_graphql_1.InputType)()
], ProductInput);
//# sourceMappingURL=ProductInput.js.map