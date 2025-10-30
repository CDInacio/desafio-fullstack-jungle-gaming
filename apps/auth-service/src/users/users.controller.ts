import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('auth/signup')
  // async signup(@Body() body: UserDto) {
  //   return await firstValueFrom(this.authClient.send('auth-signup', body));
  // }
}
