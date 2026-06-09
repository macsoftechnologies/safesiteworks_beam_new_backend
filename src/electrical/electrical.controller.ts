import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ElectricalService } from './electrical.service';
import { CreateElectricalDto, UpdateElectricalDto, ElectricalQueryDto } from './dtos/electrical.dto';

@Controller('electrical')
export class ElectricalController {
  constructor(private readonly electricalService: ElectricalService) { }

  @Get()
  async findAll(@Query() query: ElectricalQueryDto) {
    try {
      const result = await this.electricalService.findAll(query);
      return result;
    } catch (error) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'No Electrical Works Found' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const electrical = await this.electricalService.findOne(Number(id));
      if (!electrical) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Electrical Work not found' };
      }
      return electrical;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving electrical work' };
    }
  }

  @Post()
  async create(@Body() createElectricalDto: CreateElectricalDto) {
    if (!createElectricalDto.electrical_works) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Electrical Works' };
    }
    try {
      const electrical = await this.electricalService.create(createElectricalDto);
      if (electrical) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Electrical Works Created',
          data: electrical,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Electrical Works Not Created',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Electrical Works Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateElectricalDto: UpdateElectricalDto,
  ) {
    try {
      const electrical = await this.electricalService.update(Number(id), updateElectricalDto);
      if (electrical) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Electrical Works Updated',
          data: electrical,
        };
      } else {
        return {
          statusCode: HttpStatus.ACCEPTED,
          message: 'Electrical Works not updated',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Electrical Works not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const electrical = await this.electricalService.remove(Number(id));
      if (electrical) {
        return { statusCode: HttpStatus.OK, message: 'Electrical Works deleted' };
      } else {
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Electrical Works not deleted' };
      }
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Electrical Works not deleted' };
    }
  }
}
