import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class CommentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column('uuid')
  task_id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'timestamp' })
  created_at?: Date;

  @Column({ type: 'timestamp' })
  updated_at?: Date;
}
