import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class TaskHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  task_id: string;

  @Column({ type: 'text' })
  change_description: string;

  @Column({ type: 'timestamp' })
  changed_at?: Date;
}
