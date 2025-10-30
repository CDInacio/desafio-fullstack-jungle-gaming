import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';
import { UserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@repo/shared/entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  async register(userData: UserDto) {
    const userExists = await this.findByEmail(userData.email);

    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = new UserEntity();
    newUser.username = userData.username;
    newUser.email = userData.email;
    newUser.password = bcryptHashSync(userData.password, 10);

    const { id, username } = await this.userEntity.save(newUser);
    return { id, username };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const foundUser = await this.userEntity.findOne({ where: { email } });

    if (!foundUser) return null;

    return foundUser;
  }
}
