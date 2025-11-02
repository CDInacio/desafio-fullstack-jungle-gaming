import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { SignupCredentialsDto } from '@repo/shared/user';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !bcryptCompareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: user.id, user };

    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  async register(data: SignupCredentialsDto) {
    const result = await this.usersService.register(data);
    console.log(result);
    return result;
  }

  async getUsers() {
    const result = this.usersService.getUsers();
    return result;
  }
}
