import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comments1762105537864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE TABLE "comments" (
"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
"content" TEXT NOT NULL,
"task_id" UUID NOT NULL,
"user_id" UUID NOT NULL,
"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
"updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT "fk_comments_task" FOREIGN KEY ("task_id")
REFERENCES "tasks"("id") ON DELETE CASCADE,
CONSTRAINT "fk_comments_user" FOREIGN KEY ("user_id")
REFERENCES "users"("id") ON DELETE CASCADE
);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
