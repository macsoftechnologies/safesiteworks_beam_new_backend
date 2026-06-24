import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateByCountDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  Request_Date?: string;

  @IsString()
  @IsOptional()
  Company_Name?: string;

  // PermitNo of the ORIGINAL permit to copy from
  @IsString()
  @IsOptional()
  PermitNo?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  Sub_Contractor_Id?: number;

  @IsString()
  @IsOptional()
  Foreman?: string;

  @IsString()
  @IsOptional()
  Foreman_Phone_Number?: string;

  @IsString()
  @IsOptional()
  Activity?: string;

  @IsString()
  @IsOptional()
  Type_Of_Activity_Id?: string;

  @IsString()
  @IsOptional()
  Start_Time?: string;

  @IsString()
  @IsOptional()
  End_Time?: string;

  @IsString()
  @IsOptional()
  Assign_Start_Time?: string;

  @IsString()
  @IsOptional()
  Assign_End_Time?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  Site_Id?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  Building_Id?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  Floor_Id?: number;

  @IsString()
  @IsOptional()
  Room_Nos?: string;

  @IsString()
  @IsOptional()
  Room_Type?: string;

  @IsString()
  @IsOptional()
  Assign_Start_Date?: string;

  @IsString()
  @IsOptional()
  Assign_End_Date?: string;

  @IsString()
  @IsOptional()
  Request_status?: string;

  @IsString()
  @IsOptional()
  permit_under?: string;

  // zone is an array of zone IDs (numbers) — will be validated and joined
  @IsArray()
  @IsOptional()
  zone?: number[];

  @IsString()
  @IsOptional()
  createdTime?: string;

  // Number of days to repeat the insert (loop count)
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  count?: number;
}
