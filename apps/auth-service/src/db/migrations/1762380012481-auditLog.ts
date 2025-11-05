import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditLog1762380012481 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "audit_action_enum" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'COMMENT');
    `);
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "entity_type" VARCHAR(100) NOT NULL,
        "entity_id" UUID NOT NULL,
        "action" "audit_action_enum" NOT NULL,
        "user_id" UUID,
        "old_value" JSONB,
        "new_value" JSONB,
        "description" TEXT,
        "ip_address" VARCHAR(45),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "fk_audit_logs_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs" CASCADE;`);
    await queryRunner.query(`DROP TYPE IF EXISTS "audit_action_enum";`);
  }
}
