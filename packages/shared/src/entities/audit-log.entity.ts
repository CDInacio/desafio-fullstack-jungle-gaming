import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ASSIGN = "ASSIGN",
  COMMENT = "COMMENT",
}

@Entity("audit_logs")
export class AuditLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "entity_type" })
  entityType: string; // Ex: "task", "user", "comment"

  @Column({ type: "uuid", name: "entity_id" })
  entityId: string; // ID da entidade afetada

  @Column({ type: "enum", enum: AuditAction })
  action: AuditAction;

  @Column({ type: "uuid", name: "user_id", nullable: true })
  userId: string; // Quem fez a ação

  @Column({ type: "jsonb", nullable: true, name: "old_value" })
  oldValue: Record<string, any>; // Estado anterior

  @Column({ type: "jsonb", nullable: true, name: "new_value" })
  newValue: Record<string, any>; // Estado novo

  @Column({ type: "text", nullable: true })
  description: string; // Descrição legível da ação

  @Column({ type: "varchar", nullable: true, name: "ip_address" })
  ipAddress: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
