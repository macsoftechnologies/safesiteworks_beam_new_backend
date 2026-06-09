import { Controller, Get, UseGuards, Query, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@Query() query: PaginationQueryDto) {
    const usersResult = await this.usersService.getAllUsers(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      ...usersResult,
    };
  }
}
