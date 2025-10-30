import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskHistory1761773904941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE "task_history" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "task_id" UUID NOT NULL,
                "action" VARCHAR(50) NOT NULL,
                "changed_by" UUID NOT NULL,
                "old_value" JSONB,
                "new_value" JSONB,
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "fk_task_history_task" FOREIGN KEY ("task_id")
                REFERENCES "tasks"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_task_history_changed_by" FOREIGN KEY ("changed_by")
                REFERENCES "user"("id") ON DELETE CASCADE
                );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
