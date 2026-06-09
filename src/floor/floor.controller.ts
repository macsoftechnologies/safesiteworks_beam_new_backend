import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto, UpdateFloorDto, FloorQueryDto } from './dtos/floor.dto';

@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Get()
  async findAll(@Query() query: FloorQueryDto) {
    try {
      const floors = await this.floorService.findAll(query);
      return floors;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving floors' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const floor = await this.floorService.findOne(Number(id));
      if (!floor) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Floor not found' };
      }
      return floor;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving floor' };
    }
  }

  @Post()
  async create(@Body() createFloorDto: CreateFloorDto) {
    try {
      const floor = await this.floorService.create(createFloorDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Floor Created',
        data: floor,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Floor Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFloorDto: UpdateFloorDto,
  ) {
    try {
      const floor = await this.floorService.update(Number(id), updateFloorDto);
      if (!floor) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Floor not found',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Floor Updated',
        data: floor,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Floor not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const floor = await this.floorService.remove(Number(id));
      if (!floor) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Floor not found' };
      }
      return { statusCode: HttpStatus.OK, message: 'Floor deleted' };
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Floor not deleted' };
    }
  }
}
