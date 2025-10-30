import { IsNotEmpty } from 'class-validator';

export class DataDto {
  @IsNotEmpty()
  text: string;
}
