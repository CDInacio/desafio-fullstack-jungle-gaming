import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto, TaskPriority, TaskStatus } from '@repo/shared/task';
import { PaginationQuery } from '@repo/shared/pagination';
import { Repository, DataSource } from 'typeorm';
import { TaskAssignmentEntity } from '@repo/shared/entities/task-assignment';
import { TaskEntity } from '@repo/shared/entities/task';
import { UserEntity } from '@repo/shared/entities/user';
// import { In } from 'typeorm';
import { CommentEntity } from '@repo/shared/entities/comment';
import { AuditService } from './audit/audit.service';
import { AuditAction } from '@repo/shared/entities/audit-log';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskAssignmentEntity)
    private taskAssignmentRepository: Repository<TaskAssignmentEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private dataSource: DataSource,
    private auditService: AuditService,
  ) {}

  async createTask(payload: CreateTaskDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = this.taskRepository.create({
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        deadline: payload.deadline,
        createdBy: payload.createdBy,
      });

      const savedTask = await queryRunner.manager.save(task);

      if (!savedTask.id) {
        throw new Error('Failed to create task: ID not generated');
      }

      await this.auditService.log({
        entityType: 'task',
        entityId: savedTask.id,
        action: AuditAction.CREATE,
        userId: payload.createdBy,
        newValue: savedTask,
        description: `Task "${savedTask.title}" criada`,
      });

      if (payload.assignedUsers && payload.assignedUsers.length > 0) {
        const assignments = payload.assignedUsers.map((user) =>
          this.taskAssignmentRepository.create({
            taskId: savedTask.id,
            userId: user.id,
          }),
        );

        await queryRunner.manager.save(assignments);

        await this.auditService.log({
          entityType: 'task',
          entityId: savedTask.id,
          action: AuditAction.ASSIGN,
          userId: payload.createdBy,
          newValue: { assignedUsers: payload.assignedUsers },
          description: `${payload.assignedUsers.length} usuário(s) atribuído(s) à task`,
        });
      }

      await queryRunner.commitTransaction();

      const taskWithAssignments = await this.taskRepository.findOne({
        where: { id: savedTask.id },
        relations: ['assignments', 'assignments.user'],
      });

      return {
        message: 'Task criada com sucesso',
        data: taskWithAssignments,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateTask(id: string, updateData: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar task anterior
      const oldTask = await this.taskRepository.findOne({ where: { id } });

      if (!oldTask) {
        throw new Error('Task not found');
      }

      // Atualizar
      await queryRunner.manager.update(TaskEntity, { id }, updateData);

      const updatedTask = await this.taskRepository.findOne({
        where: { id },
        relations: ['assignments', 'assignments.user'],
      });

      if (!updatedTask) {
        throw new Error('Failed to retrieve updated task');
      }

      const diff = this.auditService.getDiff(oldTask, updatedTask);

      // Registrar auditoria - UPDATE
      await this.auditService.log({
        entityType: 'task',
        entityId: id,
        action: AuditAction.UPDATE,
        userId: updateData.updatedBy || oldTask.createdBy,
        oldValue: diff.old,
        newValue: diff.new,
        description: `Task "${updatedTask.title}" atualizada`,
      });

      await queryRunner.commitTransaction();

      return {
        message: 'Task atualizada com sucesso',
        data: updatedTask,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTasks(query: PaginationQuery) {
    try {
      const page = query.page && query.page > 0 ? query.page : 1;
      const size =
        query.size && query.size > 0 && query.size <= 100 ? query.size : 10;
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'DESC';

      const skip = (page - 1) * size;

      const validSortFields = [
        'createdAt',
        'updatedAt',
        'title',
        'status',
        'priority',
        'deadline',
      ];

      const orderField = validSortFields.includes(sortBy)
        ? sortBy
        : 'createdAt';

      const [tasks, total] = await this.taskRepository.findAndCount({
        relations: {
          assignments: {
            user: true,
            assigner: true,
          },
          creator: true,
        },
        take: size,
        skip: skip,
        order: {
          [orderField]: sortOrder,
        },
      });

      const totalPages = Math.ceil(total / size);

      const formattedTasks = tasks.map((task) => ({
        ...task,
        creator: task.creator
          ? {
              id: task.creator.id,
              username: task.creator.username,
              email: task.creator.email,
            }
          : null,
        assignments:
          task.assignments?.map((assignment) => ({
            id: assignment.id,
            taskId: assignment.taskId,
            userId: assignment.userId,
            assignedAt: assignment.assignedAt,
            assignedBy: assignment.assignedBy,
            user: assignment.user
              ? {
                  id: assignment.user.id,
                  username: assignment.user.username,
                  email: assignment.user.email,
                }
              : null,
            assigner: assignment.assigner
              ? {
                  id: assignment.assigner.id,
                  username: assignment.assigner.username,
                  email: assignment.assigner.email,
                }
              : null,
          })) || [],
      }));

      return {
        message: 'Tasks retrieved successfully',
        data: {
          tasks: formattedTasks,
          pagination: {
            totalItems: total,
            totalPages: totalPages,
            currentPage: page,
            pagesize: size,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
      };
    } catch (error) {
      this.logger.error(`Error getting tasks: ${error.message}`);
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get tasks',
        error: error.message,
      });
    }
  }

  async getTaskById(id: string) {
    try {
      this.logger.log(`Getting task with ID: ${id}`);
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: {
          assignments: {
            user: true,
            assigner: true,
          },
          creator: true,
          comments: {
            user: true,
          },
        },
      });

      if (!task) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Task with ID ${id} not found`,
        });
      }

      if (task.comments && task.comments.length > 0) {
        task.comments.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
      // const formattedTask = {
      //   ...task,
      //   creator: task.creator
      //     ? {
      //         id: task.creator.id,
      //         username: task.creator.username,
      //         email: task.creator.email,
      //       }
      //     : null,
      //   assignments:
      //     task.assignments?.map((assignment) => ({
      //       id: assignment.id,
      //       taskId: assignment.taskId,
      //       userId: assignment.userId,
      //       assignedAt: assignment.assignedAt,
      //       assignedBy: assignment.assignedBy,
      //       user: assignment.user
      //         ? {
      //             id: assignment.user.id,
      //             username: assignment.user.username,
      //             email: assignment.user.email,
      //           }
      //         : null,
      //       assigner: assignment.assigner
      //         ? {
      //             id: assignment.assigner.id,
      //             username: assignment.assigner.username,
      //             email: assignment.assigner.email,
      //           }
      //         : null,
      //     })) || [],
      // };

      return {
        statusCode: HttpStatus.OK,
        message: 'Task retrieved successfully',
        data: task,
      };
    } catch (error) {
      // this.logger.error(`Error getting task: ${error.message}`);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get task',
        error: error.message,
      });
    }
  }

  async deleteTaskById(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new Error('Task not found');
    }

    await this.taskRepository.delete(id);

    // Registrar auditoria - DELETE
    await this.auditService.log({
      entityType: 'task',
      entityId: id,
      action: AuditAction.DELETE,
      userId: task.createdBy ?? undefined,
      oldValue: task,
      description: `Task "${task.title}" deletada`,
    });

    return {
      message: 'Task deletada com sucesso',
    };
  }

  async createComment(payload: {
    content: string;
    userId: string;
    taskId: string;
  }) {
    try {
      this.logger.log(`Creating comment for task ${payload.taskId}`);

      const task = await this.taskRepository.findOne({
        where: { id: payload.taskId },
        relations: {
          assignments: {
            user: true,
          },
        },
      });

      if (!task) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Task with ID ${payload.taskId} not found`,
        });
      }

      await this.auditService.log({
        entityType: 'task',
        entityId: payload.taskId,
        action: AuditAction.COMMENT,
        userId: payload.userId,
        newValue: { content: payload.content },
        description: `Comentário adicionado à task`,
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `User with ID ${payload.userId} not found`,
        });
      }

      const comment = this.commentRepository.create({
        content: payload.content,
        taskId: payload.taskId,
        userId: payload.userId,
      });

      const savedComment = await this.commentRepository.save(comment);

      const assignedUserIds = task.assignments?.map((a) => a.userId) || [];

      const commentWithRelations = await this.commentRepository.findOne({
        where: { id: savedComment.id },
        relations: {
          user: true,
          task: true,
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Comment created successfully',
        data: commentWithRelations,
        userIds: assignedUserIds,
        metadata: {
          taskId: task.id,
          taskTitle: task.title,
          commentId: savedComment.id,
          userId: payload.userId,
        },
      };
    } catch (error) {
      this.logger.error(`Error creating comment: ${error.message}`);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create comment',
        error: error.message,
      });
    }
  }

  // Adicione este método para buscar comentários paginados
  async getTaskComments(taskId: string, query: PaginationQuery) {
    try {
      const page = query.page && query.page > 0 ? query.page : 1;
      const size =
        query.size && query.size > 0 && query.size <= 100 ? query.size : 10;
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'DESC';

      const skip = (page - 1) * size;

      const task = await this.taskRepository.findOne({
        where: { id: taskId },
      });

      if (!task) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Task with ID ${taskId} not found`,
        });
      }

      const [comments, total] = await this.commentRepository.findAndCount({
        where: { taskId },
        relations: {
          user: true,
        },
        take: size,
        skip: skip,
        order: {
          [sortBy]: sortOrder,
        },
      });

      const totalPages = Math.ceil(total / size);

      return {
        statusCode: HttpStatus.OK,
        message: 'Comments retrieved successfully',
        data: {
          comments,
          pagination: {
            totalItems: total,
            totalPages: totalPages,
            currentPage: page,
            pageSize: size,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
        },
      };
    } catch (error) {
      this.logger.error(`Error getting comments: ${error.message}`);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get comments',
        error: error.message,
      });
    }
  }

  async getTaskHistory(taskId: string) {
    const history = await this.auditService.getEntityHistory(
      'task',
      taskId,
      100,
    );

    return {
      message: 'Histórico recuperado com sucesso',
      data: history,
    };
  }

  async getUserHistory(userId: string) {
    const history = await this.auditService.getUserHistory(userId, 100);

    return {
      message: 'Histórico recuperado com sucesso',
      data: history,
    };
  }
}
