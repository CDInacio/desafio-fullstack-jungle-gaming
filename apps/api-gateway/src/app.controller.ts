import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_TCP, TASK_SERVICE_RABBITMQ } from '@repo/shared/index';
import type { PaginationQuery } from '@repo/shared/pagination';
import type {
  CreateTaskDto,
  QueryParams,
  TaskCommentDto,
} from '@repo/shared/task';
import type {
  SigninCredentialsDto,
  SignupCredentialsDto,
} from '@repo/shared/user';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Controller('api')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject(TASK_SERVICE_RABBITMQ) private readonly taskClient: ClientProxy,
    @Inject(AUTH_SERVICE_TCP) private readonly authClient: ClientProxy,
  ) {}

  // ============================= AUTHENTICATION & REGISTRATION =============================

  @Post('auth/login')
  async login(@Body() body: SigninCredentialsDto) {
    // usamos o ".send" pois precisamos esperar por uma resposta (síncrono),
    // caso contrário (assincrono), usaríamos o ".emit"
    // "firstValueFrom" converte o Observable retornado pelo ".send" em uma Promise
    // para podermos usar o "await" e esperar pela resposta do microserviço
    try {
      const result = await firstValueFrom(
        this.authClient.send('auth-login', body),
      );

      if (result.error)
        throw new HttpException(result.error, HttpStatus.UNAUTHORIZED);

      return { message: 'Login realizado com sucesso.', data: result };
    } catch (error) {
      this.logger.error('Falha ao realizar o login:', error);
      throw error;
    }
  }

  @Post('auth/register')
  async register(@Body() body: SignupCredentialsDto) {
    try {
      const result = await firstValueFrom(
        this.authClient.send('auth-register', body).pipe(
          timeout(5000), // tempo máximo de espera por uma resposta
          catchError((err) => {
            throw new HttpException(
              'Auth service is unavailable',
              HttpStatus.SERVICE_UNAVAILABLE,
            );
          }),
        ),
      );

      if (result.error)
        throw new HttpException(result.error, HttpStatus.BAD_REQUEST);

      return { message: 'User registered successfully', data: result };
    } catch (error) {
      this.logger.error('Error in register:', error);
      throw error;
    }
  }

  // ================================ TASKS CRUD ==================================

  @Post('tasks')
  async createTask(@Body() body: CreateTaskDto) {
    try {
      await firstValueFrom(this.taskClient.send('task.created', body));
    } catch (error) {
      this.logger.error('Error emitting task creation event:', error);
      throw new HttpException(
        'Failed to emit task creation event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tasks')
  async getTasks(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
  ) {
    try {
      if (page < 1) page = 1;
      if (size < 1) size = 10;
      if (size > 100) size = 100;

      const query = { page, size, sortBy, sortOrder };

      const result = await firstValueFrom(
        this.taskClient.send('task.getAll', query),
      );
      return result;
    } catch (error) {
      this.logger.error('Error emitting tasks getAll event:', error);
      throw new HttpException(
        'Failed to emit tasks getAll event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tasks/:id')
  async getTaskById(@Param('id') id: string) {
    try {
      this.logger.log(`Fetching task with ID: ${id}`);

      const result = await firstValueFrom(
        this.taskClient.send('task.get', id).pipe(timeout(5000)),
      );

      this.logger.log(`Task fetched successfully: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error fetching task: ${JSON.stringify(error)}`);

      // Tratar erros específicos do RPC
      if (error?.statusCode === 404) {
        throw new HttpException(
          error.message || 'Task not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (error?.statusCode === 400) {
        throw new HttpException(
          error.message || 'Invalid UUID format',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Failed to fetch task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/tasks/:id')
  async updateTaskById(@Param('id') id: string, @Body() body: any) {
    try {
      this.taskClient.emit('task.update', { id, ...body });
    } catch (error) {
      this.logger.error('Error emitting task update event:', error);
      throw new HttpException(
        'Failed to emit task update event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/tasks/:id')
  async deleteTaskById(@Param('id') id: string) {
    try {
      this.taskClient.emit('task.delete', id);
    } catch (error) {
      this.logger.error('Error emitting task delete event:', error);
      throw new HttpException(
        'Failed to emit task delete event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ================================ TASK COMMENTS ==================================

  @Post('/tasks/:id/comments')
  async createTaskComment(
    @Param('id') taskId: string,
    @Body() body: TaskCommentDto,
  ) {
    try {
      const payload = {
        content: body.content,
        userId: body.userId,
        taskId: taskId,
      };

      const result = await firstValueFrom(
        this.taskClient.send('comment.create', payload),
      );

      return result;
    } catch (error) {
      this.logger.error('Error creating comment:', error);
      throw new HttpException(
        'Failed to create comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ================================ USERS ==================================

  @Get('/users')
  async getUsers() {
    try {
      const result = await firstValueFrom(
        this.authClient.send('users.get', {}),
      );
      return result;
    } catch (error) {
      this.logger.error('Error emitting users get event:', error);
      throw new HttpException(
        'Failed to emit users get event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
