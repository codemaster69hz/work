"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250503111507 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250503111507 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "product" add column "average_rating" int null, add column "review_count" int null;');
    }
    async down() {
        this.addSql('alter table "product" drop column "average_rating", drop column "review_count";');
    }
}
exports.Migration20250503111507 = Migration20250503111507;
//# sourceMappingURL=Migration20250503111507.js.map