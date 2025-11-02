import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto, TaskPriority, TaskStatus } from '@repo/shared/task';
import { PaginationQuery, PaginatedResponse } from '@repo/shared/pagination';
import { Repository, DataSource } from 'typeorm';
import { TaskAssignmentEntity } from '@repo/shared/entities/task-assignment';
import { TaskEntity } from '@repo/shared/entities/task';
import { UserEntity } from '@repo/shared/entities/user';

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
    private dataSource: DataSource,
  ) {}

  async createTask(task: CreateTaskDto) {
    try {
      const result = await this.dataSource.transaction(async (manager) => {
        const newTask = manager.create(TaskEntity, {
          title: task.title,
          description: task.description,
          status: TaskStatus[task.status ?? TaskStatus.TODO],
          priority: TaskPriority[task.priority ?? TaskPriority.MEDIUM],
          deadline: task.deadline,
          // createdBy: task.createdBy,
        });

        const savedTask = await manager.save(TaskEntity, newTask);

        let savedAssignments: TaskAssignmentEntity[] = [];
        if (
          savedTask.id &&
          task.assignedUsers &&
          task.assignedUsers.length > 0
        ) {
          const assignments = task.assignedUsers.map((user) => {
            return manager.create(TaskAssignmentEntity, {
              taskId: savedTask.id,
              userId: user.id,
              assignedBy: task.createdBy,
            });
          });
          // console.log(assignments);
          savedAssignments = await manager.save(
            TaskAssignmentEntity,
            assignments,
          );
        }

        const taskWithAssignments = await manager.findOne(TaskEntity, {
          where: { id: savedTask.id },
          relations: ['assignments'],
        });

        return taskWithAssignments;
      });

      const response = {
        statusCode: HttpStatus.CREATED,
        message: 'Task created successfully',
        data: result,
      };
      return response;
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to create task',
        error: error.message,
      });
    }
  }

  async getTasks(query: PaginationQuery) {
    try {
      const page = query.page && query.page > 0 ? query.page : 1;
      const limit =
        query.limit && query.limit > 0 && query.limit <= 100 ? query.limit : 10;
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'DESC';

      const skip = (page - 1) * limit;

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
        take: limit,
        skip: skip,
        order: {
          [orderField]: sortOrder,
        },
      });

      const totalPages = Math.ceil(total / limit);

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
            pageLimit: limit,
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

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid UUID format',
          error: `Invalid ID: ${id}`,
        });
      }

      // ✅ Buscar task com relacionamentos
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: {
          assignments: {
            user: true,
            assigner: true,
          },
          creator: true,
        },
      });

      if (!task) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: `Task with ID ${id} not found`,
        });
      }

      const formattedTask = {
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
      };

      return {
        statusCode: HttpStatus.OK,
        message: 'Task retrieved successfully',
        data: formattedTask,
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
    try {
      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) {
        throw new RpcException({
          statusCode: 404,
          message: `Task with ID ${id} not found`,
        });
      }

      return { message: `Task with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: 500,
        message: 'Failed to delete task',
        error: error.message,
      });
    }
  }
}
