import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dtos/department.dto';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    const departments = await this.departmentService.findAll(query);
    return departments;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const department = await this.departmentService.findOne(Number(id));
    if (!department) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Department not found' };
    }
    return department;
  }

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    try {
      const department = await this.departmentService.create(createDepartmentDto);
      return department;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Department Not Created',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    try {
      const department = await this.departmentService.update(Number(id), updateDepartmentDto);
      return department;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Department not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const department = await this.departmentService.remove(Number(id));
      return department;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Department not deleted',
      };
    }
  }
}
