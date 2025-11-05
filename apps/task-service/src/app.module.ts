import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.mobule';
import { TaskEntity } from '@repo/shared/entities/task';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE_RABBITMQ } from '@repo/shared/index';
import { TaskAssignmentEntity } from '@repo/shared/entities/task-assignment';
import { UserEntity } from '@repo/shared/entities/user';
import { CommentEntity } from '@repo/shared/entities/comment';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskAssignmentEntity,
      UserEntity,
      CommentEntity,
    ]),
    ClientsModule.register([
      {
        name: NOTIFICATION_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
