import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreatePrecautionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Precaution must not be empty' })
  precaution: string;
}

export class UpdatePrecautionDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Precaution must not be empty' })
  precaution?: string;
}

export class PrecautionQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  precaution?: string;
}
