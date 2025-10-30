import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class TaskAssignmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  task_id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'timestamp' })
  assigned_at?: Date;

  @Column('uuid')
  assigned_by: string;
}
