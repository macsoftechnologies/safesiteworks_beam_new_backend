import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, CreateRoleByCountDto, UpdateRoleDto } from './dtos/role.dto';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const role = await this.roleService.findOne(Number(id));
    if (!role) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'Role not found' };
    }
    return role;
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return await this.roleService.create(createRoleDto);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Role Not Created',
      };
    }
  }

  @Post('create-by-count')
  async createByCount(@Body() createRoleByCountDto: CreateRoleByCountDto) {
    try {
      return await this.roleService.createByCount(createRoleByCountDto);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Roles Not Created',
      };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return await this.roleService.update(Number(id), updateRoleDto);
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Role not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.roleService.remove(Number(id));
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Role not deleted',
      };
    }
  }
}
