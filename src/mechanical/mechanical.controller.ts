import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { MechanicalService } from './mechanical.service';
import { CreateMechanicalDto, UpdateMechanicalDto, MechanicalQueryDto } from './dtos/mechanical.dto';

@Controller('mechanical')
export class MechanicalController {
  constructor(private readonly mechanicalService: MechanicalService) { }

  @Get()
  async findAll(@Query() query: MechanicalQueryDto) {
    try {
      const result = await this.mechanicalService.findAll(query);
      return result;
    } catch (error) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'No Mechanical Works Found' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const mechanical = await this.mechanicalService.findOne(Number(id));
      if (!mechanical) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Mechanical Work not found' };
      }
      return mechanical;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving mechanical work' };
    }
  }

  @Post()
  async create(@Body() createMechanicalDto: CreateMechanicalDto) {
    if (!createMechanicalDto.mechanical_works) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Mechanical Works' };
    }
    try {
      const mechanical = await this.mechanicalService.create(createMechanicalDto);
      if (mechanical) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Mechanical Works Created',
          data: mechanical,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Mechanical Works Not Created',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Mechanical Works Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMechanicalDto: UpdateMechanicalDto,
  ) {
    try {
      const mechanical = await this.mechanicalService.update(Number(id), updateMechanicalDto);
      if (mechanical) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Mechanical Works Updated',
          data: mechanical,
        };
      } else {
        return {
          statusCode: HttpStatus.ACCEPTED,
          message: 'Mechanical Works not updated',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Mechanical Works not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const mechanical = await this.mechanicalService.remove(Number(id));
      if (mechanical) {
        return { statusCode: HttpStatus.OK, message: 'Mechanical Works deleted' };
      } else {
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Mechanical works not deleted' };
      }
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Mechanical works not deleted' };
    }
  }
}
