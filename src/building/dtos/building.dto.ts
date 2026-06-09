import { IsString, IsNotEmpty, IsOptional, IsInt, MinLength, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreateBuildingDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Building name must not be empty' })
  building_name: string;

  @IsString()
  @IsOptional()
  building_status?: string;

  @IsString()
  @IsOptional()
  building_image?: string;

  @IsInt()
  @IsNotEmpty()
  site_id: number;
}

export class UpdateBuildingDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Building name must not be empty' })
  building_name?: string;

  @IsString()
  @IsOptional()
  building_status?: string;

  @IsString()
  @IsOptional()
  building_image?: string;

  @IsInt()
  @IsOptional()
  site_id?: number;
}

export class BuildingQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  siteid?: number;
}
