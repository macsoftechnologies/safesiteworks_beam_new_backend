import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreateMechanicalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Mechanical works must not be empty' })
  mechanical_works: string;
}

export class UpdateMechanicalDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Mechanical works must not be empty' })
  mechanical_works?: string;
}

export class MechanicalQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  mechanical_works?: string;
}
