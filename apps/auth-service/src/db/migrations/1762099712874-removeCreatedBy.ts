// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class RemoveCreatedBy1762099712874 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//       ALTER TABLE "tasks"
//       DROP CONSTRAINT IF EXISTS "fk_tasks_created_by"
//     `);

//     // Remover coluna
//     await queryRunner.query(`
//       ALTER TABLE "tasks"
//       DROP COLUMN IF EXISTS "created_by"
//     `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//       ALTER TABLE "tasks"
//       ADD COLUMN "created_by" UUID
//     `);

//     // Recriar constraint
//     await queryRunner.query(`
//       ALTER TABLE "tasks"
//       ADD CONSTRAINT "fk_tasks_created_by"
//       FOREIGN KEY ("created_by")
//       REFERENCES "user"("id")
//       ON DELETE CASCADE
//     `);
//   }
// }
