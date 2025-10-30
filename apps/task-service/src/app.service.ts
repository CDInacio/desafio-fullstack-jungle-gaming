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
    const newTask = new TaskEntity();
    newTask.title = task.title;
    newTask.description = task.description;
    newTask.status = TaskStatus[task.status ?? TaskStatus.TODO];
    newTask.priority = TaskPriority[task.priority ?? TaskPriority.MEDIUM];
    newTask.deadline = task.deadline;
    newTask.createdBy = task.createdBy;

    const respose = await this.taskRepository.save(newTask);
    return respose;
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task)
      throw new HttpException(
        `Task with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

    return task;
  }

  async deleteTaskById(id: string) {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new HttpException(
        `Task with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { message: `Task with ID ${id} deleted successfully` };
  }
}
