import { ExceptionFilter } from '@repo/shared/exceptions/rpc';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: 'notification_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new ExceptionFilter());

  await app.listen();
  Logger.log(`🚀 Notification Service is listening for messages...`);
}
bootstrap();
