import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_TCP, TASK_SERVICE_RABBITMQ } from '@repo/shared/index';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_TCP,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: TASK_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'task_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
