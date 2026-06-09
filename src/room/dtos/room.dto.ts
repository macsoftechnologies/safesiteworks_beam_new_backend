import { IsString, IsNotEmpty, IsOptional, IsInt, MinLength, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Room name must not be empty' })
  room_name: string;

  @IsString()
  @IsOptional()
  room_status?: string;

  @IsString()
  @IsOptional()
  room_image?: string;

  @IsInt()
  @IsNotEmpty()
  fl_id: number;
}

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Room name must not be empty' })
  room_name?: string;

  @IsString()
  @IsOptional()
  room_status?: string;

  @IsString()
  @IsOptional()
  room_image?: string;

  @IsInt()
  @IsOptional()
  fl_id?: number;
}

export class RoomQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  flid?: number;
}
