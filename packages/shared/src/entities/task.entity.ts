import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 50, default: "TODO" })
  status: string;

  @Column({ type: "varchar", length: 50, default: "MEDIUM" })
  priority: string;

  @Column({ type: "timestamp", nullable: true })
  deadline?: Date;

  @Column({ type: "uuid", name: "created_by" })
  createdBy: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: "created_at",
  })
  createdAt?: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    name: "updated_at",
  })
  updatedAt?: Date;
}
