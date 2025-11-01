import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TaskEntity } from "./task.entity";

@Entity("task_assignments")
export class TaskAssignmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "uuid", name: "task_id" })
  taskId: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: "assigned_at",
  })
  assignedAt?: Date;

  @Column({ type: "uuid", name: "assigned_by" })
  assignedBy: string;

  @ManyToOne(() => TaskEntity, (task) => task.assignments)
  @JoinColumn({ name: "task_id" })
  task?: TaskEntity;
}
