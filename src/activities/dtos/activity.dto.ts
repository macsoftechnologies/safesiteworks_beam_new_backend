import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Activity name must not be empty' })
  activityName: string;
}

export class UpdateActivityDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Activity name must not be empty' })
  activityName?: string;
}

export class ActivitiesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  activityName?: string;
}
