import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity, AuditAction } from '@repo/shared/entities/audit-log';

export interface CreateAuditLogDto {
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  description?: string;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLogEntity)
    private auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async log(data: CreateAuditLogDto): Promise<AuditLogEntity | null> {
    try {
      const auditLog = this.auditLogRepository.create(data);
      return await this.auditLogRepository.save(auditLog);
    } catch (error) {
      this.logger.error(
        `Failed to create audit log: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async getEntityHistory(
    entityType: string,
    entityId: string,
    limit = 50,
  ): Promise<AuditLogEntity[]> {
    return this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUserHistory(userId: string, limit = 50): Promise<AuditLogEntity[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  generateDescription(
    action: AuditAction,
    entityType: string,
    details?: any,
  ): string {
    switch (action) {
      case AuditAction.CREATE:
        return `${entityType} criado`;
      case AuditAction.UPDATE:
        return `${entityType} atualizado`;
      case AuditAction.DELETE:
        return `${entityType} deletado`;
      case AuditAction.ASSIGN:
        return `Usuário atribuído ao ${entityType}`;
      case AuditAction.COMMENT:
        return `Comentário adicionado ao ${entityType}`;
      default:
        return `Ação realizada no ${entityType}`;
    }
  }

  getDiff(oldValue: any, newValue: any): { old: any; new: any } {
    const changes = { old: {}, new: {} };

    if (!oldValue) return { old: null, new: newValue };
    if (!newValue) return { old: oldValue, new: null };

    const allKeys = new Set([
      ...Object.keys(oldValue),
      ...Object.keys(newValue),
    ]);

    allKeys.forEach((key) => {
      // Ignora campos que não devemos auditar
      if (['password', 'updatedAt', 'updated_at'].includes(key)) return;

      if (JSON.stringify(oldValue[key]) !== JSON.stringify(newValue[key])) {
        changes.old[key] = oldValue[key];
        changes.new[key] = newValue[key];
      }
    });

    return changes;
  }

  async getAllLogs(filters?: {
    action?: string;
    entityType?: string;
    page?: number;
    limit?: number;
  }): Promise<AuditLogEntity[]> {
    const { action, entityType, page = 1, limit = 100 } = filters || {};

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    if (action) {
      queryBuilder.andWhere('audit.action = :action', { action });
    }

    if (entityType) {
      queryBuilder.andWhere('audit.entityType = :entityType', { entityType });
    }

    return queryBuilder
      .orderBy('audit.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }
}
