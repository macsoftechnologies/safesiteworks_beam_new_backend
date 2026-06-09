import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
  ],

  controllers: [UsersController],

  providers: [UsersService],
})
export class UsersModule {}