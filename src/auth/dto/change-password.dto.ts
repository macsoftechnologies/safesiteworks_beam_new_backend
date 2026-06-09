import { IsString, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
