import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '@repo/shared/entities/user';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from 'src/strategies/jwt-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '10s',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, UsersService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
