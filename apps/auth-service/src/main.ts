import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from '@repo/shared/exceptions/rpc';
import { createWinstonLogger } from '@repo/shared/winston-logger';

async function bootstrap() {
  const logger = createWinstonLogger('Auth-Service');
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    );

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new ExceptionFilter());

    await app.listen();
    logger.log(' Auth Service is listening on port 3001', 'Bootstrap');
  } catch (error) {
    logger.error('Failed to start Auth Service', error);
    process.exit(1);
  }
}

bootstrap();
