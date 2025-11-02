import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '@repo/shared/entities/task';
import { TaskAssignmentEntity } from '@repo/shared/entities/task-assignment';
import { UserEntity } from '@repo/shared/entities/user';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: +(configService.get<number>('DB_PORT') ?? 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '12345678'),
        database: configService.get<string>('DB_NAME', 'challenge_db'),
        entities: [TaskEntity, TaskAssignmentEntity, UserEntity],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
