import { IsOptional, IsString, IsObject, IsArray } from 'class-validator';

export class DashboardFilterDto {
  @IsString()
  @IsOptional()
  building?: string;

  @IsString()
  @IsOptional()
  floor?: string;

  @IsObject()
  @IsOptional()
  permitTypes?: {
    commissioning?: boolean;
    construction?: boolean;
  };

  @IsObject()
  @IsOptional()
  permitStatuses?: {
    opened?: boolean;
    approved?: boolean;
    rejected?: boolean;
    draft?: boolean;
    autoCancel?: boolean;
  };

  @IsObject()
  @IsOptional()
  activityRiskTypes?: {
    nonHra?: boolean;
    hra?: boolean;
    hotWork?: boolean;
    electrical?: boolean;
    hazardousSubstances?: boolean;
    workingAtHeight?: boolean;
    confinedSpaces?: boolean;
    excavation?: boolean;
    cranesLifting?: boolean;
    pressureTesting?: boolean;
  };

  @IsArray()
  @IsOptional()
  selectedCompanies?: string[];

  @IsString()
  @IsOptional()
  roomSearch?: string;
}
