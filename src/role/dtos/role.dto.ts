import { IsString, IsNotEmpty, IsInt, IsPositive, Min } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;
}

export class CreateRoleByCountDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  count: number;
}

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName?: string;
}
