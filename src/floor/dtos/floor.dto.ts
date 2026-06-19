import { IsString, IsNotEmpty, IsOptional, IsInt, MinLength, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreateFloorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Floor name must not be empty' })
  floor_name: string;

  @IsString()
  @IsOptional()
  floor_image?: string;

  @IsInt()
  @IsNotEmpty()
  build_id: number;
}

export class UpdateFloorDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Floor name must not be empty' })
  floor_name?: string;

  @IsString()
  @IsOptional()
  floor_image?: string;

  @IsInt()
  @IsOptional()
  build_id?: number;
}

export class FloorQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  bid?: number;
}
