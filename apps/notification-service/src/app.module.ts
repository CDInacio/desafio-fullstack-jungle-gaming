import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      // signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AppController, NotificationsGateway],
  providers: [AppService, NotificationsGateway],
  exports: [NotificationsGateway],
})
export class AppModule {}
