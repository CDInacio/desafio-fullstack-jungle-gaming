import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@repo/shared/entities/user';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +(configService.get<number>('DB_PORT') ?? 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [UserEntity],
        migrations: [__dirname + '/migrations/*.ts'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
