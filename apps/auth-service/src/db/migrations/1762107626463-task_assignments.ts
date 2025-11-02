import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskAssignments1762107626463 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE "task_assignments" (
"id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
"task_id" UUID NOT NULL,
"user_id" UUID NOT NULL,
"assigned_at" TIMESTAMP NOT NULL DEFAULT NOW(),
"assigned_by" UUID NOT NULL,
CONSTRAINT "fk_task_assignments_task" FOREIGN KEY ("task_id")
REFERENCES "tasks"("id") ON DELETE CASCADE,
CONSTRAINT "fk_task_assignments_user" FOREIGN KEY ("user_id")
REFERENCES "users"("id") ON DELETE CASCADE,
CONSTRAINT "fk_task_assignments_assigned_by" FOREIGN KEY ("assigned_by")
REFERENCES "users"("id") ON DELETE CASCADE,
CONSTRAINT "uq_task_user_assignment" UNIQUE ("task_id", "user_id")
);
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "task_assignments" CASCADE;`);
  }
}
