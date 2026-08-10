import { IsString, IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../redis/dtos/pagination.dto';

export class CreateSubcontractorDto {
  @Transform(({ value }) => {
    if (!value || value === 'undefined' || value === 'null') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsNumber()
  @IsOptional()
  departId?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Subcontractor name must be at least 2 characters long' })
  subContractorName: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateSubcontractorDto {
  @Transform(({ value }) => {
    if (!value || value === 'undefined' || value === 'null') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsNumber()
  @IsOptional()
  departId?: number;

  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Subcontractor name must be at least 2 characters long' })
  subContractorName?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class SubcontractorPaginationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
