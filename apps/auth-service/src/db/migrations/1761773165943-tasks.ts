import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tasks1761773165943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "tasks" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" VARCHAR(255) NOT NULL,
                "description" TEXT,
                "status" VARCHAR(50) NOT NULL DEFAULT 'TODO',
                "priority" VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
                "deadline" TIMESTAMP,
                "created_by" UUID NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "fk_tasks_created_by" FOREIGN KEY ("created_by")
                REFERENCES "user"("id") ON DELETE CASCADE
);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks";`);
  }
}
