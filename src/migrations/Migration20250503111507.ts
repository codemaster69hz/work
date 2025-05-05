import { Migration } from '@mikro-orm/migrations';

export class Migration20250503111507 extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table "product" add column "average_rating" int null, add column "review_count" int null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "product" drop column "average_rating", drop column "review_count";');
  }

}
