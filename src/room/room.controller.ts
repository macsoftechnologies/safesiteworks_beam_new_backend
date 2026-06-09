import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto, UpdateRoomDto, RoomQueryDto } from './dtos/room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll(@Query() query: RoomQueryDto) {
    try {
      const rooms = await this.roomService.findAll(query);
      return rooms;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving rooms' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const room = await this.roomService.findOne(Number(id));
      if (!room) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Room not found' };
      }
      return room;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving room' };
    }
  }

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    try {
      const room = await this.roomService.create(createRoomDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Room Created',
        data: room,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Room Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    try {
      const room = await this.roomService.update(Number(id), updateRoomDto);
      if (!room) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Room not found',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Room Updated',
        data: room,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Room not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const room = await this.roomService.remove(Number(id));
      if (!room) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Room not found' };
      }
      return { statusCode: HttpStatus.OK, message: 'Room deleted' };
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Room not deleted' };
    }
  }
}
