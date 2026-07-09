import { Controller, Get, UseGuards, Query, HttpStatus, Request } from '@nestjs/common';
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
  async getUsers(@Query() query: PaginationQueryDto, @Request() req: any) {
    const usersResult = await this.usersService.getAllUsers(query, req.user?.userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      ...usersResult,
    };
  }
}
