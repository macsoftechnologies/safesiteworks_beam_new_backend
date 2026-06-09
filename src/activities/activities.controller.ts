import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, UpdateActivityDto, ActivitiesQueryDto } from './dtos/activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  @Get()
  async findAll(@Query() query: ActivitiesQueryDto) {
    try {
      const result = await this.activitiesService.findAll(query);
      return result;
    } catch (error) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'No Activities Found' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const activity = await this.activitiesService.findOne(Number(id));
      if (!activity) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Activity not found' };
      }
      return activity;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving activity' };
    }
  }

  @Post()
  async create(@Body() createActivityDto: CreateActivityDto) {
    if (!createActivityDto.activityName) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Activities' };
    }
    try {
      const activity = await this.activitiesService.create(createActivityDto);
      if (activity) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Activity Created',
          data: activity,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Activity Not Created',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Activity Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    try {
      const activity = await this.activitiesService.update(Number(id), updateActivityDto);
      if (activity) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Activity Updated',
          data: activity,
        };
      } else {
        return {
          statusCode: HttpStatus.ACCEPTED,
          message: 'Activity not updated',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Activity not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const activity = await this.activitiesService.remove(Number(id));
      if (activity) {
        return { statusCode: HttpStatus.OK, message: 'Activity deleted' };
      } else {
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Activity not deleted' };
      }
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Activity not deleted' };
    }
  }
}
