import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment/config');
        }
        return {
          global: true,
          secret,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
  exports: [NotificationsGateway],
})
export class AppModule {}
