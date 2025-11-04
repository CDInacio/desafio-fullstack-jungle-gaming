import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { SignupCredentialsDto } from '@repo/shared/user';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { UserDto } from 'src/users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (
      !user ||
      !user.password ||
      !bcryptCompareSync(password, user.password)
    ) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = {
      email: user.email,
      sub: {
        username: user.username,
        userId: user.id,
      },
    };

    const token = this.jwtService.sign(payload);

    return {
      ...user,
      token,
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: UserDto) {
    const payload = {
      username: user.email,
      sub: {
        name: user.username,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
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
