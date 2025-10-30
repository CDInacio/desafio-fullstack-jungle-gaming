import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto, TaskPriority, TaskStatus } from '@repo/shared/task';
import { Repository } from 'typeorm';
import { TaskEntity } from '@repo/shared/entities/task';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}

  async createTask(task: CreateTaskDto) {
    try {
      const newTask = new TaskEntity();
      newTask.title = task.title;
      newTask.description = task.description;
      newTask.status = TaskStatus[task.status ?? TaskStatus.TODO];
      newTask.priority = TaskPriority[task.priority ?? TaskPriority.MEDIUM];
      newTask.deadline = task.deadline;
      newTask.createdBy = task.createdBy;

      const respose = await this.taskRepository.save(newTask);
      return respose;
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create task',
        error: error.message,
      });
    }
  }

  async getTaskById(id: string) {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        throw new RpcException({
          statusCode: 404,
          message: `Task with ID ${id} not found`,
        });
      }

      return task;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        statusCode: 500,
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
