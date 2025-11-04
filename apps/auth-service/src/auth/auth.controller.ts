import {
  type SigninCredentialsDto,
  type SignupCredentialsDto,
} from '@repo/shared/user';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth-login')
  async login(@Payload() data: SigninCredentialsDto) {
    try {
      const result = await this.authService.login(data.email, data.password);
      return result;
    } catch (error) {
      console.error('Login error in microservice:', error);
      return { error: error.message };
    }
  }

  @MessagePattern('refresh-token')
  async refreshToken(@Payload() data: any) {
    try {
      const result = await this.authService.refreshToken(data.user);
      return result;
    } catch (error) {
      console.error('Refresh token error in microservice:', error);
      return { error: error.message };
    }
  }

  @MessagePattern('auth-register')
  async register(@Payload() data: SignupCredentialsDto) {
    try {
      const result = await this.authService.register(data);
      return result;
    } catch (error) {
      console.error('Register error in microservice:', error);
      return { error: error.message };
    }
  }

  @MessagePattern('users.get')
  async getUsers() {
    try {
      const result = await this.authService.getUsers();
      return result;
    } catch (error) {
      console.error('Get users error in microservice:', error);
      return { error: error.message };
    }
  }
}
