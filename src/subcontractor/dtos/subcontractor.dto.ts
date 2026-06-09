import { IsString, IsNotEmpty, IsNumber, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSubcontractorDto {
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsNotEmpty()
  departId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Subcontractor name must be at least 2 characters long' })
  subContractorName: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateSubcontractorDto {
  @Transform(({ value }) => (value ? Number(value) : undefined))
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
