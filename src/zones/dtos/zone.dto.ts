import { IsString, IsNotEmpty, IsOptional, IsInt, MinLength, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Zone name must not be empty' })
  zone: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsInt()
  @IsOptional()
  building_id?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @IsOptional()
  floor_id?: number;
}

export class UpdateZoneDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Zone name must not be empty' })
  zone?: string;

  @IsString()
  @IsOptional()
  level?: string;

  @IsInt()
  @IsOptional()
  building_id?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  @IsOptional()
  floor_id?: number;
}

export class ZonesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  building_id?: number;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
