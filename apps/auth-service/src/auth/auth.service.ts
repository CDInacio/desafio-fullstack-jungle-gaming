import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { SignupCredentialsDto } from '@repo/shared/user';
import { compareSync as bcryptCompareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log(user);

    if (!user || !bcryptCompareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async register(data: SignupCredentialsDto) {
    const result = await this.usersService.register(data);
    console.log(result);
    return result;
  }
}
