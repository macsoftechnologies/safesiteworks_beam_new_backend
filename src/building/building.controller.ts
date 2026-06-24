import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BuildingService } from './building.service';
import { CreateBuildingDto, UpdateBuildingDto, BuildingQueryDto } from './dtos/building.dto';

@Controller('buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) { }

  @Get()
  async findAll(@Query() query: BuildingQueryDto) {
    try {
      const buildings = await this.buildingService.findAll(query);
      return buildings;
    } catch (error) {
      console.error('Error retrieving buildings:', error);
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving buildings' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const building = await this.buildingService.findOne(Number(id));
      if (!building) {
        return { message: 'Building not found' };
      }
      return building;
    } catch (error) {
      console.error('Error retrieving building:', error);
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving building' };
    }
  }

  @Post()
  async create(@Body() createBuildingDto: CreateBuildingDto) {
    try {
      const building = await this.buildingService.create(createBuildingDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Building Created',
        data: building,
      };
    } catch (error) {
      console.error('Error creating building:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Building Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ) {
    try {
      const building = await this.buildingService.update(Number(id), updateBuildingDto);
      if (!building) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Building not found',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Building Updated',
        data: building,
      };
    } catch (error) {
      console.error('Error updating building:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Building not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const building = await this.buildingService.remove(Number(id));
      if (!building) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Building not found' };
      }
      return { statusCode: HttpStatus.OK, message: 'Building deleted' };
    } catch (error) {
      console.error('Error removing building:', error);
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Building not deleted' };
    }
  }
}
