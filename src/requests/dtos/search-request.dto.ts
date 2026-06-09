import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SearchRequestDto {
  // Pagination
  @IsNumber()
  @IsOptional()
  Page?: number;

  @IsNumber()
  @IsOptional()
  End?: number; // acts as limit

  // Main filters
  @IsString()
  @IsOptional()
  PermitNo?: string;

  @IsString()
  @IsOptional()
  fromDate?: string;

  @IsString()
  @IsOptional()
  toDate?: string;

  @IsString()
  @IsOptional()
  Activity?: string;

  @IsString()
  @IsOptional()
  Request_status?: string;

  @IsNumber()
  @IsOptional()
  Site_Id?: number;

  @IsNumber()
  @IsOptional()
  Building_Id?: number;

  // Floor_Id accepts either a numeric floor ID or a floor name string
  @IsString()
  @IsOptional()
  Floor_Id?: string;

  // Room_Nos accepts either a numeric room ID or a room name string
  @IsString()
  @IsOptional()
  Room_Nos?: string;

  @IsNumber()
  @IsOptional()
  Zone_Id?: number;

  @IsNumber()
  @IsOptional()
  Sub_Contractor_Id?: number;

  @IsNumber()
  @IsOptional()
  Type_Of_Activity_Id?: number;

  @IsString()
  @IsOptional()
  Room_Type?: string;

  @IsString()
  @IsOptional()
  permit_type?: string;

  @IsString()
  @IsOptional()
  permit_under?: string;

  @IsString()
  @IsOptional()
  night_shift?: string;

  @IsString()
  @IsOptional()
  new_date?: string;

  @IsString()
  @IsOptional()
  new_end_time?: string;

  @IsString()
  @IsOptional()
  Start_Time?: string;

  @IsString()
  @IsOptional()
  End_Time?: string;

  // Login Type for role validation
  @IsString()
  @IsOptional()
  LoginType?: string;

  @IsNumber()
  @IsOptional()
  user_id?: number;

  // Safety work flags from sub-tables
  @IsNumber()
  @IsOptional()
  Hot_work?: number;

  @IsNumber()
  @IsOptional()
  working_on_electrical_system?: number;

  @IsNumber()
  @IsOptional()
  working_hazardious_substen?: number;

  @IsNumber()
  @IsOptional()
  using_cranes_or_lifting?: number;

  @IsNumber()
  @IsOptional()
  pressure_tesing_of_equipment?: number; // note: matches frontend pressure_tesing_of_equipment

  @IsNumber()
  @IsOptional()
  working_at_height?: number;

  @IsNumber()
  @IsOptional()
  working_confined_spaces?: number;

  @IsNumber()
  @IsOptional()
  work_in_atex_area?: number;

  @IsNumber()
  @IsOptional()
  securing_facilities?: number;

  @IsNumber()
  @IsOptional()
  excavation_works?: number;

  @IsNumber()
  @IsOptional()
  specific_gloves?: number;

  @IsNumber()
  @IsOptional()
  eye_protection?: number;

  @IsNumber()
  @IsOptional()
  fall_protection?: number;

  @IsNumber()
  @IsOptional()
  hearing_protection?: number;

  @IsNumber()
  @IsOptional()
  respiratory_protection?: number;

  @IsNumber()
  @IsOptional()
  hras?: number;

  @IsNumber()
  @IsOptional()
  taskSpecificPPE?: number;

  @IsString()
  @IsOptional()
  area?: string;

  @IsNumber()
  @IsOptional()
  power_on?: number;

  @IsNumber()
  @IsOptional()
  pressurization?: number;

  @IsString()
  @IsOptional()
  permit_under_filter?: string;
}
