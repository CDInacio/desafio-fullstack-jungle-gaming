import { ExceptionFilter } from '@repo/shared/exceptions/rpc';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { createWinstonLogger } from '@repo/shared/winston-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = createWinstonLogger('Notification-Service');

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || '*',
  });

  // Conectar o microservice RMQ ao app e iniciar todos microservices
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'notification_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new ExceptionFilter());

  await app.startAllMicroservices();
  logger.log(' Notification microservice connected to RabbitMQ', 'Bootstrap');

  const port = 3005;

  await app.listen(port);
  logger.log(
    `🚀 Notification Service is listening for messages on port ${port}`,
  );
}
bootstrap();
