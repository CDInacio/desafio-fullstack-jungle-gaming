import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserDto {
  id!: string;
  username!: string;
  email!: string;
  password!: string;
}

export class SigninCredentialsDto {
  @IsEmail({}, { message: "Email inválido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email!: string;

  @IsString({ message: "Senha deve ser uma string" })
  @IsNotEmpty({ message: "Senha é obrigatória" })
  @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  password!: string;
}

export class SignupCredentialsDto {
  @IsString({ message: "Nome de usuário deve ser uma string" })
  @IsNotEmpty({ message: "Nome de usuário é obrigatório" })
  @MinLength(2, { message: "Nome de usuário deve ter pelo menos 2 caracteres" })
  username!: string;

  @IsEmail({}, { message: "Email inválido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email!: string;

  @IsString({ message: "Senha deve ser uma string" })
  @IsNotEmpty({ message: "Senha é obrigatória" })
  @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  password!: string;
}
