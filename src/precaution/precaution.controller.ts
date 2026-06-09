import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { PrecautionService } from './precaution.service';
import { CreatePrecautionDto, UpdatePrecautionDto, PrecautionQueryDto } from './dtos/precaution.dto';

@Controller('precautions')
export class PrecautionController {
  constructor(private readonly precautionService: PrecautionService) { }

  @Get()
  async findAll(@Query() query: PrecautionQueryDto) {
    try {
      const result = await this.precautionService.findAll(query);
      return result;
    } catch (error) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'No Precaution Found' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const precaution = await this.precautionService.findOne(Number(id));
      if (!precaution) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Precaution not found' };
      }
      return precaution;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving precaution' };
    }
  }

  @Post()
  async create(@Body() createPrecautionDto: CreatePrecautionDto) {
    if (!createPrecautionDto.precaution) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Precaution' };
    }
    try {
      const precaution = await this.precautionService.create(createPrecautionDto);
      if (precaution) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Precaution Created',
          data: precaution,
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Precaution Not Created',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Precaution Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrecautionDto: UpdatePrecautionDto,
  ) {
    try {
      const precaution = await this.precautionService.update(Number(id), updatePrecautionDto);
      if (precaution) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Precaution Updated',
          data: precaution,
        };
      } else {
        return {
          statusCode: HttpStatus.ACCEPTED,
          message: 'Precaution not updated',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Precaution not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const precaution = await this.precautionService.remove(Number(id));
      if (precaution) {
        return { statusCode: HttpStatus.OK, message: 'Precaution deleted' };
      } else {
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Precaution not deleted' };
      }
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Precaution not deleted' };
    }
  }
}
