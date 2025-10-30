import { IsEmail } from "class-validator";

export class UserDto {
  id!: string;
  username!: string;
  email!: string;
  password!: string;
}

export class SigninCredentialsDto {
  email!: string;
  password!: string;
}

export class SignupCredentialsDto {
  @IsEmail()
  username!: string;
  email!: string;
  password!: string;
}
