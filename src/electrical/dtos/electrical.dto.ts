import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreateElectricalDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Electrical works must not be empty' })
  electrical_works: string;

  @IsString()
  @IsOptional()
  module?: string;
}

export class UpdateElectricalDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Electrical works must not be empty' })
  electrical_works?: string;

  @IsString()
  @IsOptional()
  module?: string;
}

export class ElectricalQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  module?: string;
}
