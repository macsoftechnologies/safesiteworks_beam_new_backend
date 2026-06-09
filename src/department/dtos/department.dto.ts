import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Department name must be at least 2 characters long' })
  departmentName: string;
}

export class UpdateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Department name must be at least 2 characters long' })
  departmentName?: string;
}
