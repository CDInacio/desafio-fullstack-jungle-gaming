import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from '@repo/shared/exceptions/rpc';
import { createWinstonLogger } from '@repo/shared/winston-logger';

async function bootstrap() {
  const logger = createWinstonLogger('Task-Service');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'task_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new ExceptionFilter());

  await app.listen();
  logger.log(' Task Service is listening for messages...', 'Bootstrap');
}
bootstrap();
