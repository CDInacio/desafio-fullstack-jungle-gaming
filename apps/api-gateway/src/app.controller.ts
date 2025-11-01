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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_TCP, TASK_SERVICE_RABBITMQ } from '@repo/shared/index';
import type { CreateTaskDto } from '@repo/shared/task';
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

      return { message: 'Login successful', data: result };
    } catch (error) {
      this.logger.error('Login failed:', error);
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
      console.log(error);
      this.logger.error('Error in register:', error);
      throw error;
    }
  }

  // ================================ TASKS CRUD ==================================

  @Post('tasks')
  async createTask(@Body() body: CreateTaskDto) {
    try {
      this.taskClient.emit('task.created', body);
      // return { message: 'Task creation event emitted' };
    } catch (error) {
      this.logger.error('Error emitting task creation event:', error);
      throw new HttpException(
        'Failed to emit task creation event',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/tasks/:id')
  async getTaskById(@Param('id') id: string) {
    try {
      this.taskClient.emit('task.get', id);
    } catch (error) {
      this.logger.error('Error emitting task get event:', error);
      throw new HttpException(
        'Failed to emit task get event',
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
}
